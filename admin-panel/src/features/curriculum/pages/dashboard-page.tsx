import { Link } from 'react-router-dom';
import { Book, FlaskConical, HelpCircle, Upload, Plus, Clock, TrendingUp } from 'lucide-react';
import { useDashboardStats, useRecentActivity } from '../hooks/use-dashboard';

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

function StatCard({ 
  icon: Icon, 
  iconBgColor, 
  iconColor, 
  value, 
  label, 
  subValue 
}: { 
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  value: number | string;
  label: string;
  subValue?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'domain': return Book;
      case 'skill': return FlaskConical;
      case 'question': return HelpCircle;
      default: return Book;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'domain': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'skill': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'question': return { bg: 'bg-green-100', text: 'text-green-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-500">Welcome to Math7 Curriculum Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Book}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          value={statsLoading ? '...' : stats?.totalDomains ?? 0}
          label="Domains"
          subValue={statsLoading ? undefined : `${stats?.publishedDomains ?? 0} published`}
        />
        <StatCard
          icon={FlaskConical}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          value={statsLoading ? '...' : stats?.totalSkills ?? 0}
          label="Skills"
          subValue={statsLoading ? undefined : `${stats?.publishedSkills ?? 0} published`}
        />
        <StatCard
          icon={HelpCircle}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          value={statsLoading ? '...' : stats?.totalQuestions ?? 0}
          label="Questions"
          subValue={statsLoading ? undefined : `${stats?.publishedQuestions ?? 0} published`}
        />
        <StatCard
          icon={Upload}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          value={statsLoading ? '...' : `v${stats?.currentVersion ?? 0}`}
          label="Current Version"
          subValue={
            statsLoading 
              ? undefined 
              : stats?.lastPublishedAt 
                ? `Published ${formatRelativeTime(stats.lastPublishedAt)}` 
                : 'Never published'
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link to="/domains/new" className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-600 text-white">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium text-purple-900">Add Domain</span>
            </Link>
            <Link to="/skills/new" className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium text-blue-900">Add Skill</span>
            </Link>
            <Link to="/questions/new" className="flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-600 text-white">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-medium text-green-900">Add Question</span>
            </Link>
            <Link to="/publish" className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-600 text-white">
                <Upload className="w-5 h-5" />
              </div>
              <span className="font-medium text-orange-900">Publish Curriculum</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          {activitiesLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-r-transparent"></div>
            </div>
          ) : activities?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <TrendingUp className="w-12 h-12 mb-2" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activities?.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const colors = getActivityColor(activity.type);
                return (
                  <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{activity.type} {activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Content Overview</h3>
            <p className="text-purple-100 text-sm">
              {statsLoading ? 'Loading...' : (
                `${stats?.publishedDomains ?? 0} of ${stats?.totalDomains ?? 0} domains, ` +
                `${stats?.publishedSkills ?? 0} of ${stats?.totalSkills ?? 0} skills, and ` +
                `${stats?.publishedQuestions ?? 0} of ${stats?.totalQuestions ?? 0} questions are published`
              )}
            </p>
          </div>
          <Link 
            to="/publish" 
            className="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors"
          >
            Review & Publish
          </Link>
        </div>
      </div>
    </div>
  );
}
