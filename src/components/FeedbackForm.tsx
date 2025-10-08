import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormProps {
  language: string;
  initialText?: string;
}

export const FeedbackForm = ({ language, initialText = "" }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState(initialText);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast({
        title: language === "ta" ? "பிழை" : "Error",
        description: language === "ta" ? "கருத்தை உள்ளிடவும்" : "Please enter feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Analyze feedback using AI
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        "analyze-feedback",
        {
          body: { text: feedback, language },
        }
      );

      if (analysisError) throw analysisError;

      // Save to database
      const { error: dbError } = await supabase.from("feedback").insert({
        original_text: feedback,
        language,
        sentiment: analysisData.sentiment,
        sentiment_score: analysisData.sentimentScore,
        positive_keywords: analysisData.positiveKeywords || [],
        negative_keywords: analysisData.negativeKeywords || [],
        ai_response: analysisData.response,
        ai_suggestions: analysisData.suggestions,
      });

      if (dbError) throw dbError;

      toast({
        title: language === "ta" ? "வெற்றி!" : "Success!",
        description: language === "ta" 
          ? "உங்கள் கருத்து பகுப்பாய்வு செய்யப்பட்டது" 
          : "Your feedback has been analyzed",
      });

      // Show AI response
      toast({
        title: language === "ta" ? "AI பதில்" : "AI Response",
        description: analysisData.response,
        duration: 8000,
      });

      setFeedback("");
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: language === "ta" ? "பிழை" : "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {language === "ta" ? "உங்கள் கருத்தை உள்ளிடவும்" : "Enter Your Feedback"}
        </label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={
            language === "ta"
              ? "உங்கள் அனுபவத்தைப் பகிருங்கள்..."
              : "Share your experience..."
          }
          className="min-h-32"
          disabled={isSubmitting}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !feedback.trim()}
        className="w-full bg-primary hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {language === "ta" ? "பகுப்பாய்வு செய்கிறது..." : "Analyzing..."}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {language === "ta" ? "சமர்ப்பிக்கவும்" : "Submit Feedback"}
          </>
        )}
      </Button>
    </Card>
  );
};