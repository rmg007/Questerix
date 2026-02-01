/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCreateQuestion, useUpdateQuestion } from '../hooks/use-questions';
import { useSkills } from '../hooks/use-skills';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Database } from '@/lib/database.types';

type Question = Database['public']['Tables']['questions']['Row'];

// Hardcoded for now based on Schema
const QUESTION_TYPES = ['multiple_choice', 'mcq_multi', 'text_input', 'boolean', 'reorder_steps'] as const;

const STATUS_OPTIONS: { value: 'draft' | 'live'; label: string; description?: string }[] = [
  { value: 'draft', label: 'Draft', description: 'Not visible to students' },
  { value: 'live', label: 'Live', description: 'Visible to students' },
];

// Zod schema for the form
const questionSchema = z.object({
  skill_id: z.string().uuid(),
  type: z.enum(QUESTION_TYPES),
  content: z.string().min(1, 'Question text is required'),
  // Options: for MCQ, list of specific objects. For others, could be flexible.
  options: z.any(), 
  solution: z.any(),
  explanation: z.string().optional(),
  points: z.coerce.number().min(1),
  status: z.enum(['draft', 'live']).default('draft'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  initialData?: Question;
}

export function QuestionForm({ initialData }: QuestionFormProps) {
  const navigate = useNavigate();
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();
  const { data: skills, isLoading: isLoadingSkills } = useSkills();

  // Helper to parse initial JSON data based on question type
  const parseOptions = (data: Question | undefined, type: string) => {
      if (!data?.options) {
          switch (type) {
              case 'multiple_choice':
              case 'mcq_multi':
                  return { options: [{ id: 'a', text: '' }, { id: 'b', text: '' }] };
              case 'boolean':
                  return { true_label: 'True', false_label: 'False' };
              case 'text_input':
                  return { placeholder: '' };
              case 'reorder_steps':
                  return { steps: [{ id: '1', text: '' }, { id: '2', text: '' }] };
              default:
                  return { options: [{ id: 'a', text: '' }, { id: 'b', text: '' }] };
          }
      }
      return data.options;
  };

  const parseSolution = (data: Question | undefined, type: string) => {
      if (!data?.solution) {
          switch (type) {
              case 'multiple_choice':
                  return '';
              case 'mcq_multi':
                  return [];
              case 'boolean':
                  return null;
              case 'text_input':
                  return '';
              case 'reorder_steps':
                  return [];
              default:
                  return '';
          }
      }
      const sol = data.solution as any;
      switch (type) {
          case 'multiple_choice':
              return sol.correct_option_id || '';
          case 'mcq_multi':
              return sol.correct_ids || [];
          case 'boolean':
              return sol.correct_value ?? null;
          case 'text_input':
              return sol.exact_match || '';
          case 'reorder_steps':
              return sol.correct_order || [];
          default:
              return sol.correct_option_id || '';
      }
  };

  const initialType = initialData?.type || 'multiple_choice';
  
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      skill_id: initialData?.skill_id || '',
      type: initialType as QuestionFormData['type'],
      content: initialData?.content || '',
      explanation: initialData?.explanation || '',
      points: initialData?.points || 1,
      status: (initialData as any)?.status || 'draft',
      options: parseOptions(initialData, initialType), 
      solution: parseSolution(initialData, initialType),
    },
  });

  const questionType = form.watch('type');
  const prevTypeRef = useRef(questionType);

  useEffect(() => {
    if (prevTypeRef.current !== questionType && !initialData) {
      const defaultOptions = parseOptions(undefined, questionType);
      const defaultSolution = parseSolution(undefined, questionType);
      form.setValue('options', defaultOptions);
      form.setValue('solution', defaultSolution);
      form.clearErrors();
    }
    prevTypeRef.current = questionType;
  }, [questionType, form, initialData]);

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const submissionData = { ...data };

      if (data.type === 'multiple_choice') {
          const opts = data.options as { options: { id: string, text: string}[] };
          const correctId = data.solution as string;
          
          if (!correctId) {
             form.setError('solution', { message: 'Please select a correct answer' });
             return;
          }

          submissionData.options = opts;
          submissionData.solution = { correct_option_id: correctId };
      } else if (data.type === 'mcq_multi') {
          const opts = data.options as { options: { id: string, text: string}[] };
          const correctIds = data.solution as string[];
          
          if (!correctIds || correctIds.length === 0) {
             form.setError('solution', { message: 'Please select at least one correct answer' });
             return;
          }

          submissionData.options = opts;
          submissionData.solution = { correct_ids: correctIds };
      } else if (data.type === 'boolean') {
          const opts = data.options as { true_label?: string, false_label?: string };
          const correctValue = data.solution as boolean | null;
          
          if (correctValue === null || correctValue === undefined) {
             form.setError('solution', { message: 'Please select the correct answer (True or False)' });
             return;
          }

          submissionData.options = {
              true_label: opts.true_label || 'True',
              false_label: opts.false_label || 'False'
          };
          submissionData.solution = { correct_value: correctValue };
      } else if (data.type === 'text_input') {
          const opts = data.options as { placeholder?: string };
          const exactMatch = data.solution as string;
          
          if (!exactMatch || exactMatch.trim() === '') {
             form.setError('solution', { message: 'Please enter the correct answer' });
             return;
          }

          submissionData.options = { placeholder: opts.placeholder || '' };
          submissionData.solution = { exact_match: exactMatch.trim() };
      } else if (data.type === 'reorder_steps') {
          const opts = data.options as { steps: { id: string, text: string}[] };
          const correctOrder = data.solution as string[];
          
          if (!opts.steps || opts.steps.length < 2) {
             form.setError('options', { message: 'Please add at least 2 steps' });
             return;
          }
          
          if (!correctOrder || correctOrder.length !== opts.steps.length) {
             form.setError('solution', { message: 'Please set the correct order for all steps' });
             return;
          }

          submissionData.options = opts;
          submissionData.solution = { correct_order: correctOrder };
      }

      if (initialData) {
        await updateQuestion.mutateAsync({
           id: initialData.id,
           ...submissionData
        } as any);
      } else {
        await createQuestion.mutateAsync(submissionData as any);
      }
      navigate('/questions');
    } catch (error) {
      console.error('Failed to save question:', error);
    }
  };

  const isSubmitting = createQuestion.isPending || updateQuestion.isPending;

  // Custom Field Array for MCQ Options
  // We need to access control for dynamic fields
  // Since `options` is `any`, we need to cast or manage carefully.
  // Let's manually manage the options array in the render for now, updating the form value.
  const currentOptions = (form.watch('options') as any)?.options || [];
  const setOptions = (newOptions: any[]) => {
      form.setValue('options', { options: newOptions });
  };

  const addOption = () => {
     const nextId = String.fromCharCode(97 + currentOptions.length); // a, b, c...
     setOptions([...currentOptions, { id: nextId, text: '' }]);
  };

  const removeOption = (index: number) => {
      const newOpts = [...currentOptions];
      newOpts.splice(index, 1);
      setOptions(newOpts);
  };

  const updateOptionText = (index: number, text: string) => {
      const newOpts = [...currentOptions];
      newOpts[index].text = text;
      setOptions(newOpts);
  };

  // MCQ Multi helpers
  const currentSelectedIds = (form.watch('solution') as string[]) || [];
  const toggleSelectedId = (id: string) => {
      const current = [...currentSelectedIds];
      const idx = current.indexOf(id);
      if (idx >= 0) {
          current.splice(idx, 1);
      } else {
          current.push(id);
      }
      form.setValue('solution', current);
  };

  // Boolean helpers
  const currentBooleanOpts = form.watch('options') as { true_label?: string, false_label?: string } || {};
  const booleanAnswer = form.watch('solution') as boolean | null;

  // Text input helpers
  const currentTextOpts = form.watch('options') as { placeholder?: string } || {};
  const textAnswer = form.watch('solution') as string || '';

  // Reorder steps helpers
  const currentSteps = (form.watch('options') as any)?.steps || [];
  const currentOrder = (form.watch('solution') as string[]) || [];

  const setSteps = (newSteps: any[]) => {
      form.setValue('options', { steps: newSteps });
  };

  const addStep = () => {
      const nextId = String(currentSteps.length + 1);
      const newSteps = [...currentSteps, { id: nextId, text: '' }];
      setSteps(newSteps);
      form.setValue('solution', [...currentOrder, nextId]);
  };

  const removeStep = (index: number) => {
      const stepId = currentSteps[index].id;
      const newSteps = [...currentSteps];
      newSteps.splice(index, 1);
      setSteps(newSteps);
      const newOrder = currentOrder.filter((id: string) => id !== stepId);
      form.setValue('solution', newOrder);
  };

  const updateStepText = (index: number, text: string) => {
      const newSteps = [...currentSteps];
      newSteps[index].text = text;
      setSteps(newSteps);
  };

  const moveStepInOrder = (index: number, direction: 'up' | 'down') => {
      const newOrder = [...currentOrder];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return;
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      form.setValue('solution', newOrder);
  };

  if (isLoadingSkills) return <Loader2 className="animate-spin" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 md:space-y-6 w-full max-w-3xl px-1">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control as any}
            name="skill_id"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Skill</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="min-h-[48px] text-base">
                        <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {skills?.map((skill) => (
                            <SelectItem key={skill.id} value={skill.id}>
                                {skill.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control as any}
            name="type"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger className="min-h-[48px] text-base">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {QUESTION_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t.replace('_', ' ').toUpperCase()}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control as any}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <RichTextEditor 
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="What is 2 + 2?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {questionType === 'multiple_choice' && (
            <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium text-sm">Multiple Choice Options</h3>
                <RadioGroup 
                    onValueChange={(val) => form.setValue('solution', val)} 
                    defaultValue={form.watch('solution') as string}
                >
                    {currentOptions.map((opt: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                            <RadioGroupItem value={opt.id} id={opt.id} />
                            <div className="flex-1 flex gap-2">
                                <span className="flex h-10 w-8 items-center justify-center rounded-md border bg-muted text-sm font-medium">
                                    {opt.id.toUpperCase()}
                                </span>
                                <Input 
                                    value={opt.text} 
                                    onChange={(e) => updateOptionText(index, e.target.value)}
                                    placeholder={`Option ${opt.id.toUpperCase()}`}
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                                <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    ))}
                </RadioGroup>
                 <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
                {form.formState.errors.solution && (
                     <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.solution.message as string}
                     </p>
                )}
            </div>
        )}

        {questionType === 'mcq_multi' && (
            <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium text-sm">Multiple Choice (Multiple Answers)</h3>
                <p className="text-sm text-muted-foreground">Select all correct answers using the checkboxes.</p>
                <div className="space-y-3">
                    {currentOptions.map((opt: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                            <Checkbox 
                                checked={currentSelectedIds.includes(opt.id)}
                                onCheckedChange={() => toggleSelectedId(opt.id)}
                            />
                            <div className="flex-1 flex gap-2">
                                <span className="flex h-10 w-8 items-center justify-center rounded-md border bg-muted text-sm font-medium">
                                    {opt.id.toUpperCase()}
                                </span>
                                <Input 
                                    value={opt.text} 
                                    onChange={(e) => updateOptionText(index, e.target.value)}
                                    placeholder={`Option ${opt.id.toUpperCase()}`}
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)}>
                                <Trash className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Option
                </Button>
                {form.formState.errors.solution && (
                     <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.solution.message as string}
                     </p>
                )}
            </div>
        )}

        {questionType === 'boolean' && (
            <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium text-sm">True/False Question</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <FormLabel>True Label (optional)</FormLabel>
                        <Input 
                            value={currentBooleanOpts.true_label || ''} 
                            onChange={(e) => form.setValue('options', { ...currentBooleanOpts, true_label: e.target.value })}
                            placeholder="True"
                        />
                    </div>
                    <div className="space-y-2">
                        <FormLabel>False Label (optional)</FormLabel>
                        <Input 
                            value={currentBooleanOpts.false_label || ''} 
                            onChange={(e) => form.setValue('options', { ...currentBooleanOpts, false_label: e.target.value })}
                            placeholder="False"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <FormLabel>Correct Answer</FormLabel>
                    <div className="flex gap-4">
                        <Button 
                            type="button" 
                            variant={booleanAnswer === true ? 'default' : 'outline'}
                            onClick={() => form.setValue('solution', true)}
                            className="flex-1"
                        >
                            {currentBooleanOpts.true_label || 'True'}
                        </Button>
                        <Button 
                            type="button" 
                            variant={booleanAnswer === false ? 'default' : 'outline'}
                            onClick={() => form.setValue('solution', false)}
                            className="flex-1"
                        >
                            {currentBooleanOpts.false_label || 'False'}
                        </Button>
                    </div>
                </div>
                {form.formState.errors.solution && (
                     <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.solution.message as string}
                     </p>
                )}
            </div>
        )}

        {questionType === 'text_input' && (
            <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium text-sm">Text Input Question</h3>
                <div className="space-y-2">
                    <FormLabel>Placeholder (optional)</FormLabel>
                    <Input 
                        value={currentTextOpts.placeholder || ''} 
                        onChange={(e) => form.setValue('options', { placeholder: e.target.value })}
                        placeholder="Enter your answer..."
                    />
                </div>
                <div className="space-y-2">
                    <FormLabel>Correct Answer (exact match)</FormLabel>
                    <Input 
                        value={textAnswer} 
                        onChange={(e) => form.setValue('solution', e.target.value)}
                        placeholder="The exact correct answer"
                    />
                </div>
                {form.formState.errors.solution && (
                     <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.solution.message as string}
                     </p>
                )}
            </div>
        )}

        {questionType === 'reorder_steps' && (
            <div className="space-y-4 border p-4 rounded-md">
                <h3 className="font-medium text-sm">Reorder Steps</h3>
                <p className="text-sm text-muted-foreground">Add steps and set their correct order using the arrows.</p>
                
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Steps (define the content)</h4>
                    <div className="space-y-3">
                        {currentSteps.map((step: any, index: number) => (
                            <div key={step.id} className="flex items-center gap-4">
                                <span className="flex h-10 w-8 items-center justify-center rounded-md border bg-muted text-sm font-medium">
                                    {step.id}
                                </span>
                                <Input 
                                    value={step.text} 
                                    onChange={(e) => updateStepText(index, e.target.value)}
                                    placeholder={`Step ${step.id} text`}
                                    className="flex-1"
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)} disabled={currentSteps.length <= 2}>
                                    <Trash className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addStep} className="mt-2">
                        <Plus className="mr-2 h-4 w-4" /> Add Step
                    </Button>
                </div>

                <div className="space-y-2 pt-4 border-t">
                    <h4 className="text-sm font-medium">Correct Order</h4>
                    <p className="text-xs text-muted-foreground">Use the arrows to arrange steps in the correct order.</p>
                    <div className="space-y-2">
                        {currentOrder.map((stepId: string, index: number) => {
                            const step = currentSteps.find((s: any) => s.id === stepId);
                            return (
                                <div key={stepId} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                    <span className="font-medium text-sm w-6">{index + 1}.</span>
                                    <span className="flex-1 text-sm">{step?.text || `Step ${stepId}`}</span>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => moveStepInOrder(index, 'up')}
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => moveStepInOrder(index, 'down')}
                                        disabled={index === currentOrder.length - 1}
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {form.formState.errors.solution && (
                     <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.solution.message as string}
                     </p>
                )}
                {form.formState.errors.options && (
                     <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.options.message as string}
                     </p>
                )}
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control as any}
            name="points"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl>
                    <Input type="number" min={1} {...field} className="min-h-[48px] text-base" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
                control={form.control as any}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="min-h-[48px] text-base">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}{option.description ? ` - ${option.description}` : ''}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

         <FormField
          control={form.control as any}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation</FormLabel>
              <FormControl>
                <RichTextEditor 
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Explain why the answer is correct..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/questions')} className="w-full sm:w-auto min-h-[48px] px-6">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-h-[48px] px-6">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
