import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";

export default function MarketTrends() {
  const { data: trends, isLoading } = useQuery({
    queryKey: ['/api/market-trends', 'Pottery'],
  });

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="market-trends">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="market-trends-title">
            Market Trends
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4" data-testid="market-trends-description">
          View demand patterns and pricing suggestions for your craft category.
        </p>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4" data-testid="trends-stats">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary" data-testid="demand-increase">
                  +{trends?.demandIncrease || 28}%
                </p>
                <p className="text-xs text-muted-foreground">Demand This Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent" data-testid="avg-price">
                  ${trends?.avgPrice || 45}
                </p>
                <p className="text-xs text-muted-foreground">Avg. Price Range</p>
              </div>
            </div>
          )}
          
          <div className="bg-muted rounded-lg p-3" data-testid="trending-keywords">
            <p className="text-sm text-foreground font-medium mb-2">Trending Keywords:</p>
            <div className="flex flex-wrap gap-1">
              {(trends?.keywords || ["sustainable", "handmade", "eco-friendly"]).map((keyword: string, index: number) => (
                <span 
                  key={index}
                  className="bg-background text-foreground px-2 py-1 rounded text-xs"
                  data-testid={`trending-keyword-${index}`}
                >
                  "{keyword}"
                </span>
              ))}
            </div>
          </div>
          
          <div className="h-24 bg-muted rounded-lg p-3 flex items-center justify-center" data-testid="trend-chart-placeholder">
            <p className="text-sm text-muted-foreground">📈 Trend Chart Visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
