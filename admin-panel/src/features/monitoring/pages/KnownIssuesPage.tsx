import { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  Search, 
  Filter,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { useKnownIssues } from '../hooks/use-known-issues';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export function KnownIssuesPage() {
  const { data: issues, isLoading } = useKnownIssues();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = issues?.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Open</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 flex items-center gap-1 border-none"><CheckCircle2 className="w-3 h-3" /> Resolved</Badge>;
      case 'recurring':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Recurring</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 font-bold';
      case 'high': return 'text-orange-600 font-semibold';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Known Issues & Post-Mortems
          </h2>
          <p className="text-muted-foreground mt-1">
            Documentation of technical crashes, business logic bugs, and their resolutions.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all hover:scale-105">
          <Plus className="w-4 h-4 mr-2" /> Record Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-indigo-50/50 border-indigo-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-900">Total Tracked</p>
                <p className="text-2xl font-bold text-indigo-700">{issues?.length ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-900">Active Bugs</p>
                <p className="text-2xl font-bold text-amber-700">
                  {issues?.filter(i => i.status === 'open' || i.status === 'recurring').length ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900">Fixed & Documented</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {issues?.filter(i => i.status === 'closed').length ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden border-indigo-100/50">
        <CardHeader className="bg-gray-50/50 border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Issue Library</CardTitle>
              <CardDescription>Search and filter identified system issues.</CardDescription>
            </div>
            <div className="flex items-center gap-2 max-w-sm w-full">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search issues..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/30">
              <TableRow>
                <TableHead>Issue title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date Identified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">Loading issues...</TableCell>
                </TableRow>
              ) : filteredIssues?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <LifeBuoy className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No issues found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues?.map((issue) => (
                  <TableRow key={issue.id} className="group cursor-pointer hover:bg-indigo-50/20">
                    <TableCell>
                      <div className="font-medium group-hover:text-indigo-600 transition-colors">{issue.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{issue.description}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(issue.status)}</TableCell>
                    <TableCell>
                      <span className={`text-xs uppercase tracking-wider ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(issue.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {issue.sentry_link && (
                          <Button variant="ghost" size="icon" asChild title="View on Sentry">
                            <a href={issue.sentry_link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 text-indigo-400 hover:text-indigo-600" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          View details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="p-6 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
             <img src="/sentry-logo.png" alt="" className="h-6 w-6 opacity-80" onError={(e) => (e.currentTarget.style.display = 'none')} />
             <AlertCircle className="h-6 w-6 text-slate-400" />
          </div>
          <div>
            <h4 className="font-semibold">Sentry Integration Active</h4>
            <p className="text-sm text-slate-400">Technical crashes are automatically captured and linked here for post-mortems.</p>
          </div>
        </div>
        <div className="hidden md:block">
          <Button variant="outline" className="text-slate-100 border-slate-700 hover:bg-slate-800">
            Open Sentry Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
