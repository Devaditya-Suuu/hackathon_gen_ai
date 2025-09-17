import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import StatsCards from "@/components/stats-cards";
import StoryGenerator from "@/components/story-generator";
import ImageAnalyzer from "@/components/image-analyzer";
import SocialOptimizer from "@/components/social-optimizer";
import ProductOptimizer from "@/components/product-optimizer";
import HeritageAssistant from "@/components/heritage-assistant";
import MarketTrends from "@/components/market-trends";
import PortfolioBuilder from "@/components/portfolio-builder";
import RecentActivity from "@/components/recent-activity";
import type { User, Analytics } from "@shared/schema";

export default function Dashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['/api/analytics'],
  });

  return (
    <div className="bg-background font-sans antialiased">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2" data-testid="welcome-heading">
            Welcome back, <span data-testid="user-name">{user?.name || 'User'}!</span>
          </h2>
          <p className="text-muted-foreground" data-testid="welcome-description">
            Let's enhance your craft's digital presence with AI-powered tools.
          </p>
        </div>

        {/* Quick Stats */}
        <StatsCards analytics={analytics} />

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <StoryGenerator />
          <ImageAnalyzer />
          <SocialOptimizer />
          <ProductOptimizer />
          <HeritageAssistant />
          <MarketTrends />
        </div>

        {/* Portfolio Builder Section */}
        <PortfolioBuilder />

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  );
}
