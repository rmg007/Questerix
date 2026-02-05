import { useState } from 'react';
import { Plus, Pencil, Trash2, Boxes } from 'lucide-react';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject, type Subject } from '../hooks/use-subjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function SubjectsPage() {
  const { data: subjects, isLoading } = useSubjects();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color_hex: '#3B82F6',
    display_order: 1,
    status: 'active'
  });

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        slug: subject.slug,
        color_hex: subject.color_hex || '#3B82F6',
        display_order: subject.display_order,
        status: subject.status
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        slug: '',
        color_hex: '#3B82F6',
        display_order: (subjects?.length ?? 0) + 1,
        status: 'active'
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        await updateSubject.mutateAsync({ id: editingSubject.subject_id, ...formData });
        toast({ title: "Success", description: "Subject updated successfully" });
      } else {
        await createSubject.mutateAsync(formData);
        toast({ title: "Success", description: "Subject created successfully" });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save subject", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? This will delete all associated apps.')) {
      try {
        await deleteSubject.mutateAsync(id);
        toast({ title: "Success", description: "Subject deleted" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete subject", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subjects</h2>
          <p className="text-muted-foreground">Manage high-level learning subjects</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-purple-500" />
            Platform Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : subjects?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No subjects found</TableCell></TableRow>
              ) : subjects?.map((s) => (
                <TableRow key={s.subject_id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs">{s.slug}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full shadow-sm border border-white/10" style={{ backgroundColor: s.color_hex || '#ccc' }} />
                      <span className="text-xs uppercase">{s.color_hex}</span>
                    </div>
                  </TableCell>
                  <TableCell>{s.display_order}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                      s.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                    }`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(s)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.subject_id)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input 
                  id="slug" 
                  value={formData.slug} 
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })} 
                  placeholder="e.g. math"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Theme Color</Label>
                <div className="flex gap-2">
                    <Input 
                        id="color" 
                        type="color"
                        className="w-12 p-1"
                        value={formData.color_hex} 
                        onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })} 
                    />
                    <Input 
                        value={formData.color_hex} 
                        onChange={(e) => setFormData({ ...formData, color_hex: e.target.value })} 
                        placeholder="#000000"
                    />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input 
                  id="order" 
                  type="number"
                  value={formData.display_order} 
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} 
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createSubject.isPending || updateSubject.isPending}>
                {editingSubject ? 'Save Changes' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
