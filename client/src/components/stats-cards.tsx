import { Book, Camera, Share, TrendingUp } from "lucide-react";
import type { Analytics } from "@shared/schema";

interface StatsCardsProps {
  analytics?: Analytics;
}

export default function StatsCards({ analytics }: StatsCardsProps) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border border-border shadow-sm animate-pulse">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="stats-cards">
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm" data-testid="card-stories">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Stories Generated</p>
            <p className="text-2xl font-bold text-foreground" data-testid="text-stories-count">
              {analytics.storiesGenerated}
            </p>
          </div>
          <Book className="text-primary text-xl" />
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm" data-testid="card-images">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Images Analyzed</p>
            <p className="text-2xl font-bold text-foreground" data-testid="text-images-count">
              {analytics.imagesAnalyzed}
            </p>
          </div>
          <Camera className="text-accent text-xl" />
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm" data-testid="card-social">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Social Posts</p>
            <p className="text-2xl font-bold text-foreground" data-testid="text-social-count">
              {analytics.socialPosts}
            </p>
          </div>
          <Share className="text-primary text-xl" />
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm" data-testid="card-revenue">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Revenue Growth</p>
            <p className="text-2xl font-bold text-accent" data-testid="text-revenue-growth">
              +{analytics.revenueGrowth}%
            </p>
          </div>
          <TrendingUp className="text-accent text-xl" />
        </div>
      </div>
    </div>
  );
}
