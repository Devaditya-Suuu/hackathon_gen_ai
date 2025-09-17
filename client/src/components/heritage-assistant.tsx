import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Landmark, Scroll, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function HeritageAssistant() {
  const [technique, setTechnique] = useState("");
  const [culturalContext, setCulturalContext] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (data: { technique: string; culturalContext: string }) => {
      const response = await apiRequest("POST", "/api/heritage/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedStory(data.story);
      toast({
        title: "Heritage Story Generated",
        description: "Your cultural heritage story has been created!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate heritage story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!technique.trim() || !culturalContext.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both technique and cultural context.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate({ technique, culturalContext });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="heritage-assistant">
      <div className="p-6 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Landmark className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="heritage-assistant-title">
            Heritage Storytelling
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4" data-testid="heritage-assistant-description">
          Explain traditional techniques and historical significance of your craft.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="technique" className="block text-sm font-medium text-foreground mb-2">
              Technique/Tradition
            </Label>
            <Input
              id="technique"
              value={technique}
              onChange={(e) => setTechnique(e.target.value)}
              placeholder="e.g., Japanese Raku firing"
              data-testid="input-technique"
            />
          </div>
          
          <div>
            <Label htmlFor="cultural-context" className="block text-sm font-medium text-foreground mb-2">
              Cultural Context
            </Label>
            <Textarea
              id="cultural-context"
              value={culturalContext}
              onChange={(e) => setCulturalContext(e.target.value)}
              className="h-16"
              placeholder="Describe the cultural significance..."
              data-testid="textarea-cultural-context"
            />
          </div>
          
          {generatedStory && (
            <div className="bg-muted rounded-lg p-3" data-testid="generated-heritage-story">
              <p className="text-sm text-foreground font-medium mb-2">Generated Heritage Story:</p>
              <p className="text-sm text-muted-foreground" data-testid="heritage-story-content">
                {generatedStory.length > 300 
                  ? `${generatedStory.substring(0, 300)}...` 
                  : generatedStory}
              </p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="flex-1 text-sm"
              data-testid="button-generate-heritage"
            >
              {generateMutation.isPending ? (
                <>
                  <Scroll className="mr-1 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Scroll className="mr-1 h-4 w-4" />
                  Generate Story
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3"
              disabled={!generatedStory}
              data-testid="button-save-heritage"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
