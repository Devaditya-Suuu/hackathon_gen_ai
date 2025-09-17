import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Briefcase, Plus, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function PortfolioBuilder() {
  const [artistJourney, setArtistJourney] = useState("");
  const [generatedStatement, setGeneratedStatement] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const { toast } = useToast();

  const generateStatementMutation = useMutation({
    mutationFn: async (data: { artistJourney: string; inspiration?: string; philosophy?: string }) => {
      const response = await apiRequest("POST", "/api/portfolio/generate-statement", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedStatement(data.statement);
      toast({
        title: "Artist Statement Generated",
        description: "Your AI-powered artist statement has been created!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate artist statement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: { title: string; artistStatement: string; description: string; tags: string[] }) => {
      const response = await apiRequest("POST", "/api/portfolio", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Portfolio Created",
        description: "Your portfolio has been successfully created!",
      });
      setPortfolioTitle("");
      setArtistJourney("");
      setGeneratedStatement("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateStatement = () => {
    if (!artistJourney.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your artistic journey first.",
        variant: "destructive",
      });
      return;
    }
    generateStatementMutation.mutate({ artistJourney });
  };

  const handleCreatePortfolio = () => {
    if (!portfolioTitle.trim() || !generatedStatement.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and generate an artist statement first.",
        variant: "destructive",
      });
      return;
    }
    createPortfolioMutation.mutate({
      title: portfolioTitle,
      artistStatement: generatedStatement,
      description: artistJourney,
      tags: ["Traditional Pottery", "Sustainable Art"]
    });
  };

  return (
    <div className="mt-12 bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="portfolio-builder">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground" data-testid="portfolio-builder-title">
              AI Portfolio Builder
            </h3>
          </div>
          <Button 
            onClick={handleCreatePortfolio}
            disabled={createPortfolioMutation.isPending || !generatedStatement}
            data-testid="button-create-portfolio"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Portfolio
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="statement-generator-title">
              Artist Statement Generator
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="portfolio-title" className="block text-sm font-medium text-foreground mb-2">
                  Portfolio Title
                </Label>
                <Input
                  id="portfolio-title"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  placeholder="e.g., Maria's Ceramic Studio"
                  data-testid="input-portfolio-title"
                />
              </div>
              
              <div>
                <Label htmlFor="artist-journey" className="block text-sm font-medium text-foreground mb-2">
                  Your Artistic Journey
                </Label>
                <Textarea
                  id="artist-journey"
                  value={artistJourney}
                  onChange={(e) => setArtistJourney(e.target.value)}
                  className="h-32"
                  placeholder="Tell us about your artistic journey, inspiration, and philosophy..."
                  data-testid="textarea-artist-journey"
                />
              </div>
              
              <Button
                onClick={handleGenerateStatement}
                disabled={generateStatementMutation.isPending}
                data-testid="button-generate-statement"
              >
                {generateStatementMutation.isPending ? (
                  <>
                    <Pen className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Pen className="mr-2 h-4 w-4" />
                    Generate AI Statement
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="portfolio-preview-title">
              Portfolio Preview
            </h4>
            <div className="border border-border rounded-lg p-4 space-y-4" data-testid="portfolio-preview">
              <img 
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200" 
                alt="Pottery workshop" 
                className="w-full h-32 object-cover rounded-md"
                data-testid="img-portfolio-preview"
              />
              
              <div className="space-y-2">
                <h5 className="font-semibold text-foreground" data-testid="preview-title">
                  {portfolioTitle || "Your Portfolio Title"}
                </h5>
                <p className="text-sm text-muted-foreground" data-testid="preview-statement">
                  {generatedStatement || "Your AI-generated artist statement will appear here..."}
                </p>
                <div className="flex space-x-2" data-testid="preview-tags">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Traditional Pottery</span>
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">Sustainable Art</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
