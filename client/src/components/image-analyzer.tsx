import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Upload, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ImageAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<{ description: string; marketingCopy: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/images/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis({ description: data.description, marketingCopy: data.marketingCopy });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      toast({
        title: "Image Analyzed",
        description: "Marketing copy has been generated for your product!",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.status === 503
        ? "AI service is temporarily overloaded. Please try again in a moment."
        : "Failed to analyze image. Please try again later.";
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setAnalysis(null);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to analyze.",
        variant: "destructive",
      });
      return;
    }
    analyzeImageMutation.mutate(selectedFile);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden" data-testid="image-analyzer">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Eye className="text-accent-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="image-analyzer-title">
            Image Analysis
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4" data-testid="image-analyzer-description">
          Automatically generate marketing copy from photos of your artisan products.
        </p>
        
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-testid="file-upload-area"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file"
            />
            {selectedFile ? (
              <div className="space-y-2">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="Selected" 
                  className="mx-auto mb-3 rounded-lg max-h-40 object-cover"
                  data-testid="img-preview"
                />
                <p className="text-sm font-medium text-foreground" data-testid="text-filename">
                  {selectedFile.name}
                </p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground" data-testid="upload-prompt">
                  Drop images here or click to upload
                </p>
              </>
            )}
          </div>
          
          {analysis && (
            <div className="bg-muted rounded-lg p-3" data-testid="analysis-result">
              <p className="text-sm text-foreground font-medium" data-testid="analysis-title">
                Generated Description:
              </p>
              <p className="text-sm text-muted-foreground mt-1" data-testid="analysis-content">
                {analysis.marketingCopy}
              </p>
            </div>
          )}
          
          <Button
            onClick={handleAnalyze}
            disabled={!selectedFile || analyzeImageMutation.isPending}
            className="w-full"
            data-testid="button-analyze-image"
          >
            {analyzeImageMutation.isPending ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Image...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Image
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
