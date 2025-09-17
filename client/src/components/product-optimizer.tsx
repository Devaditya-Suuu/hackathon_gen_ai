import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ProductOptimizer() {
  const [productName, setProductName] = useState("");
  const [platform, setPlatform] = useState("");
  const [optimization, setOptimization] = useState<{ 
    optimizedTitle: string; 
    description: string; 
    keywords: string[] 
  } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const optimizeMutation = useMutation({
    mutationFn: async (data: { productName: string; platform: string; description?: string }) => {
      const response = await apiRequest("POST", "/api/products/optimize", data);
      return response.json();
    },
    onSuccess: (data) => {
      setOptimization({
        optimizedTitle: data.optimizedTitle,
        description: data.description,
        keywords: data.keywords
      });
      toast({
        title: "Listing Optimized",
        description: "Your product listing has been optimized for better visibility!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to optimize listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOptimize = () => {
    if (!productName.trim() || !platform) {
      toast({
        title: "Missing Information",
        description: "Please provide product name and select a platform.",
        variant: "destructive",
      });
      return;
    }
    optimizeMutation.mutate({ productName, platform });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="product-optimizer">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <ShoppingCart className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="product-optimizer-title">
            Product Listing Optimizer
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4" data-testid="product-optimizer-description">
          Generate SEO-friendly descriptions and titles for online marketplaces.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="product-name" className="block text-sm font-medium text-foreground mb-2">
              Product Name
            </Label>
            <Input
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Ceramic Bowl"
              data-testid="input-product-name"
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">Target Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-full" data-testid="select-platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Etsy">Etsy</SelectItem>
                <SelectItem value="Amazon Handmade">Amazon Handmade</SelectItem>
                <SelectItem value="Own Website">Own Website</SelectItem>
                <SelectItem value="Facebook Marketplace">Facebook Marketplace</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {optimization && (
            <div className="bg-muted rounded-lg p-3" data-testid="optimization-result">
              <p className="text-sm text-foreground font-medium mb-2">Optimized Title:</p>
              <p className="text-sm text-muted-foreground mb-3" data-testid="optimized-title">
                {optimization.optimizedTitle}
              </p>
              <p className="text-sm text-foreground font-medium mb-2">Keywords:</p>
              <div className="flex flex-wrap gap-1" data-testid="keywords-list">
                {optimization.keywords.map((keyword, index) => (
                  <span 
                    key={index}
                    className="bg-background text-foreground px-2 py-1 rounded text-xs border"
                    data-testid={`keyword-${index}`}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <Button
            onClick={handleOptimize}
            disabled={optimizeMutation.isPending}
            className="w-full"
            data-testid="button-optimize-listing"
          >
            {optimizeMutation.isPending ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Listing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Optimize Listing
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
