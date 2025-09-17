import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hash, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SocialOptimizer() {
  const [platform, setPlatform] = useState("Facebook");
  const [content, setContent] = useState("");
  const [optimization, setOptimization] = useState<{ hashtags: string[]; caption: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const optimizeMutation = useMutation({
    mutationFn: async (data: { platform: string; content: string; craftType: string }) => {
      const response = await apiRequest("POST", "/api/social/optimize", data);
      return response.json();
    },
    onSuccess: (data) => {
      setOptimization({ hashtags: data.hashtags, caption: data.caption });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      toast({
        title: "Content Optimized",
        description: "Your social media content has been optimized!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to optimize content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOptimize = () => {
    if (!content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please provide content to optimize.",
        variant: "destructive",
      });
      return;
    }
    optimizeMutation.mutate({ platform, content, craftType: "Pottery" });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="social-optimizer">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Hash className="text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="social-optimizer-title">
            Social Media Optimizer
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4" data-testid="social-optimizer-description">
          Get AI-suggested hashtags, captions, and posting strategies.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">Platform</Label>
            <div className="grid grid-cols-3 gap-2" data-testid="platform-selector">
              {["Instagram", "Facebook", "Twitter"].map((p) => (
                <Button
                  key={p}
                  variant={platform === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPlatform(p)}
                  className="text-center"
                  data-testid={`button-platform-${p.toLowerCase()}`}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-20"
              placeholder="Describe your post content..."
              data-testid="textarea-content"
            />
          </div>
          
          {optimization && (
            <div className="bg-muted rounded-lg p-3" data-testid="optimization-result">
              <p className="text-sm text-foreground font-medium mb-2">Suggested Hashtags:</p>
              <div className="flex flex-wrap gap-1 mb-3" data-testid="hashtags-list">
                {optimization.hashtags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs"
                    data-testid={`hashtag-${index}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground font-medium mb-1">Optimized Caption:</p>
              <p className="text-sm text-muted-foreground" data-testid="optimized-caption">
                {optimization.caption}
              </p>
            </div>
          )}
          
          <Button
            onClick={handleOptimize}
            disabled={optimizeMutation.isPending}
            className="w-full"
            data-testid="button-optimize-content"
          >
            {optimizeMutation.isPending ? (
              <>
                <Rocket className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Content...
              </>
            ) : (
              <>
                <Rocket className="mr-2 h-4 w-4" />
                Optimize Content
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
