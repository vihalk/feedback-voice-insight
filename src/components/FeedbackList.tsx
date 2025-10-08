import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface FeedbackListProps {
  language: string;
}

export const FeedbackList = ({ language }: FeedbackListProps) => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("feedback-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedback" },
        () => {
          fetchFeedback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setFeedbackList(data || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-5 w-5 text-success" />;
      case "negative":
        return <ThumbsDown className="h-5 w-5 text-destructive" />;
      default:
        return <Minus className="h-5 w-5 text-warning" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants: Record<string, any> = {
      positive: "default",
      negative: "destructive",
      neutral: "secondary",
    };

    const labels: Record<string, string> = {
      positive: language === "ta" ? "நேர்மறை" : "Positive",
      negative: language === "ta" ? "எதிர்மறை" : "Negative",
      neutral: language === "ta" ? "நடுநிலை" : "Neutral",
    };

    return (
      <Badge variant={variants[sentiment] || "secondary"}>
        {labels[sentiment] || sentiment}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {language === "ta" ? "சமீபத்திய கருத்துகள்" : "Recent Feedback"}
      </h2>

      {feedbackList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {language === "ta"
              ? "இன்னும் கருத்துகள் இல்லை"
              : "No feedback yet"}
          </CardContent>
        </Card>
      ) : (
        feedbackList.map((feedback) => (
          <Card key={feedback.id} className="card-hover">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-2">
                {getSentimentIcon(feedback.sentiment)}
                {getSentimentBadge(feedback.sentiment)}
                <Badge variant="outline">{feedback.language.toUpperCase()}</Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(feedback.created_at).toLocaleString()}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">
                  {language === "ta" ? "அசல் கருத்து:" : "Original Feedback:"}
                </p>
                <p className="text-sm">{feedback.original_text}</p>
              </div>

              {feedback.ai_response && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="font-medium text-sm">
                    {language === "ta" ? "AI பதில்:" : "AI Response:"}
                  </p>
                  <p className="text-sm">{feedback.ai_response}</p>
                </div>
              )}

              {feedback.ai_suggestions && (
                <div className="bg-accent/10 p-4 rounded-lg space-y-2">
                  <p className="font-medium text-sm">
                    {language === "ta" ? "பரிந்துரைகள்:" : "Suggestions:"}
                  </p>
                  <p className="text-sm">{feedback.ai_suggestions}</p>
                </div>
              )}

              {(feedback.positive_keywords?.length > 0 ||
                feedback.negative_keywords?.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {feedback.positive_keywords?.map((keyword: string, idx: number) => (
                    <Badge key={`pos-${idx}`} variant="default" className="bg-success">
                      {keyword}
                    </Badge>
                  ))}
                  {feedback.negative_keywords?.map((keyword: string, idx: number) => (
                    <Badge key={`neg-${idx}`} variant="destructive">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};