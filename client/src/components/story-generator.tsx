import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Feather, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function StoryGenerator() {
  const [craftType, setCraftType] = useState("");
  const [focus, setFocus] = useState("");
  const [generatedStory, setGeneratedStory] = useState<{ title: string; content: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateStoryMutation = useMutation({
    mutationFn: async (data: { craftType: string; focus: string }) => {
      const response = await apiRequest("POST", "/api/stories/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedStory({ title: data.title, content: data.content });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      toast({
        title: "Story Generated",
        description: "Your craft story has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!craftType || !focus.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a craft type and provide a story focus.",
        variant: "destructive",
      });
      return;
    }
    generateStoryMutation.mutate({ craftType, focus });
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="story-generator">
      <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Feather className="text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="story-generator-title">
            AI Story Generator
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4" data-testid="story-generator-description">
          Create compelling narratives about your craft and heritage using Gemini AI.
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="craft-type" className="block text-sm font-medium text-foreground mb-2">
              Craft Type
            </Label>
            <Select value={craftType} onValueChange={setCraftType}>
              <SelectTrigger className="w-full" data-testid="select-craft-type">
                <SelectValue placeholder="Select your craft" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pottery">Pottery</SelectItem>
                <SelectItem value="Weaving">Weaving</SelectItem>
                <SelectItem value="Woodworking">Woodworking</SelectItem>
                <SelectItem value="Jewelry Making">Jewelry Making</SelectItem>
                <SelectItem value="Leather Crafting">Leather Crafting</SelectItem>
                <SelectItem value="Glassblowing">Glassblowing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="story-focus" className="block text-sm font-medium text-foreground mb-2">
              Story Focus
            </Label>
            <Textarea
              id="story-focus"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full h-20"
              placeholder="Describe your inspiration, techniques, or heritage..."
              data-testid="textarea-story-focus"
            />
          </div>
          
          {generatedStory && (
            <div className="bg-muted rounded-lg p-3" data-testid="generated-story">
              <p className="text-sm text-foreground font-medium mb-2" data-testid="story-title">
                {generatedStory.title}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="story-content">
                {generatedStory.content.length > 200 
                  ? `${generatedStory.content.substring(0, 200)}...` 
                  : generatedStory.content}
              </p>
            </div>
          )}
          
          <Button
            onClick={handleGenerate}
            disabled={generateStoryMutation.isPending}
            className="w-full"
            data-testid="button-generate-story"
          >
            {generateStoryMutation.isPending ? (
              <>
                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Story...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Story
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
