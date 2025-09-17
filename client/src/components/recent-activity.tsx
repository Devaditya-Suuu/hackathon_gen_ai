import { useQuery } from "@tanstack/react-query";
import { Feather, Eye, Hash } from "lucide-react";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/activity'],
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'story':
        return <Feather className="text-primary" />;
      case 'image':
        return <Eye className="text-accent" />;
      case 'social':
        return <Hash className="text-primary" />;
      case 'heritage':
        return <Feather className="text-accent" />;
      default:
        return <Feather className="text-primary" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="mt-8 bg-card rounded-lg border border-border shadow-sm" data-testid="recent-activity">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="recent-activity-title">
          Recent AI Assistance
        </h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse">
                <div className="w-6 h-6 bg-primary/20 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-primary/20 rounded mb-1"></div>
                  <div className="h-3 bg-primary/10 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-3" data-testid="activities-list">
            {activities.map((activity: any, index: number) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 p-3 bg-muted rounded-lg"
                data-testid={`activity-${index}`}
              >
                {getIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground" data-testid={`activity-title-${index}`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`activity-time-${index}`}>
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8" data-testid="no-activities">
            <p className="text-muted-foreground">No recent activities yet. Start using the AI tools above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
