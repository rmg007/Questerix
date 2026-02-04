import React, { useState } from 'react';
import { Wand2, Download, AlertCircle } from 'lucide-react';
import { DocumentUploader } from '../components/DocumentUploader';
import { QuestionReviewGrid, GeneratedQuestion } from '../components/QuestionReviewGrid';
import { generateQuestions } from '../api/generateQuestions';
import Papa from 'papaparse';

interface DifficultyConfig {
  easy: number;
  medium: number;
  hard: number;
}

export const GenerationPage: React.FC = () => {
  const [extractedText, setExtractedText] = useState<string>('');
  const [_sourceFilename, setSourceFilename] = useState<string>(''); // Kept for future features
  const [difficultyConfig, setDifficultyConfig] = useState<DifficultyConfig>({
    easy: 10,
    medium: 20,
    hard: 10,
  });
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextExtracted = (text: string, filename: string) => {
    setExtractedText(text);
    setSourceFilename(filename);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!extractedText) {
      setError('Please upload a document first');
      return;
    }

    const totalQuestions = difficultyConfig.easy + difficultyConfig.medium + difficultyConfig.hard;
    if (totalQuestions === 0) {
      setError('Please configure at least one question');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { questions, metadata } = await generateQuestions({
        text: extractedText,
        difficulty_distribution: difficultyConfig,
        custom_instructions: customInstructions || undefined,
      });

      // Transform API response to GeneratedQuestion format
      const transformedQuestions: GeneratedQuestion[] = questions.map((q, index) => ({
        ...q,
        id: `q-${Date.now()}-${index}`,
      }));

      setGeneratedQuestions(transformedQuestions);
      console.log(`Generated ${metadata.questions_generated} questions in ${metadata.generation_time_ms}ms`);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (generatedQuestions.length === 0) return;

    const csvData = generatedQuestions.map((q) => ({
      text: q.text,
      question_type: q.question_type,
      difficulty: q.difficulty,
      options: q.metadata.options?.join(' | ') || '',
      correct_answer: Array.isArray(q.metadata.correct_answer)
        ? q.metadata.correct_answer.join(' | ')
        : q.metadata.correct_answer || '',
      explanation: q.metadata.explanation || '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    link.setAttribute('href', url);
    link.setAttribute('download', `questerix_questions_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalQuestions = difficultyConfig.easy + difficultyConfig.medium + difficultyConfig.hard;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Question Generator
        </h1>
        <p className="text-gray-600">
          Upload a document, configure generation settings, and review AI-generated questions
        </p>
      </div>

      {/* Step 1: Upload Document */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Step 1: Upload Source Document
        </h2>
        <DocumentUploader onTextExtracted={handleTextExtracted} />
      </div>

      {/* Step 2: Configure Generation */}
      {extractedText && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step 2: Configure Question Generation
          </h2>

          <div className="space-y-6">
            {/* Difficulty Distribution */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Difficulty Distribution (Total: {totalQuestions} questions)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Easy
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={difficultyConfig.easy}
                    onChange={(e) =>
                      setDifficultyConfig({
                        ...difficultyConfig,
                        easy: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Medium
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={difficultyConfig.medium}
                    onChange={(e) =>
                      setDifficultyConfig({
                        ...difficultyConfig,
                        medium: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Hard
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={difficultyConfig.hard}
                    onChange={(e) =>
                      setDifficultyConfig({
                        ...difficultyConfig,
                        hard: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Instructions (Optional)
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="E.g., Focus on algebra concepts, include word problems..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={3}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !extractedText}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating {totalQuestions} questions...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate {totalQuestions} Questions
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Export */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Step 3: Review & Export
            </h2>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export to CSV
            </button>
          </div>

          <QuestionReviewGrid
            questions={generatedQuestions}
            onQuestionsChange={setGeneratedQuestions}
          />

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              📋 Next Steps
            </h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Review and edit the generated questions above</li>
              <li>Click "Export to CSV" to download the questions</li>
              <li>Navigate to Questions page and use "Bulk Import" feature</li>
              <li>Upload the CSV file to add questions to your curriculum</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
