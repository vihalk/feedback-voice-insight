import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceInput } from "@/components/VoiceInput";
import { FeedbackForm } from "@/components/FeedbackForm";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { FeedbackList } from "@/components/FeedbackList";
import { Languages, BarChart3, MessageSquare, Sparkles } from "lucide-react";

const Index = () => {
  const [language, setLanguage] = useState("en");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const handleVoiceTranscript = (text: string) => {
    setVoiceTranscript(text);
  };

  useEffect(() => {
    // Clear transcript after 1 second to allow form to process it
    if (voiceTranscript) {
      const timer = setTimeout(() => setVoiceTranscript(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [voiceTranscript]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-5xl font-bold gradient-text">
                {language === "ta"
                  ? "கருத்து உணர்வு பகுப்பாய்வி"
                  : "Feedback Sentiment Analyzer"}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "ta"
                ? "AI-இயங்கும் பகுப்பாய்வு மூலம் உங்கள் குரலை உரையாக மாற்றவும், உணர்வுகளைப் புரிந்துகொள்ளவும் மற்றும் நுண்ணறிவுகளைப் பெறவும்"
                : "Transform your voice to text, understand sentiments, and get insights with AI-powered analysis"}
            </p>

            {/* Language Selector */}
            <div className="flex justify-center">
              <Card className="p-4 inline-flex items-center gap-3">
                <Languages className="h-5 w-5 text-primary" />
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="input" className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
              <TabsTrigger value="input" className="gap-2 py-3">
                <MessageSquare className="h-4 w-4" />
                {language === "ta" ? "கருத்து" : "Feedback"}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2 py-3">
                <BarChart3 className="h-4 w-4" />
                {language === "ta" ? "பகுப்பாய்வு" : "Analytics"}
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2 py-3">
                <MessageSquare className="h-4 w-4" />
                {language === "ta" ? "வரலாறு" : "History"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Voice Input */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center">
                      {language === "ta" ? "குரல் உள்ளீடு" : "Voice Input"}
                    </h2>
                    <VoiceInput
                      language={language}
                      onTranscript={handleVoiceTranscript}
                    />
                  </div>

                  {/* Text Input */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center">
                      {language === "ta" ? "உரை உள்ளீடு" : "Text Input"}
                    </h2>
                    <FeedbackForm language={language} voiceTranscript={voiceTranscript} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="max-w-7xl mx-auto">
                <AnalyticsDashboard language={language} />
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="max-w-5xl mx-auto">
                <FeedbackList language={language} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 card-hover text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">
              {language === "ta" ? "பல மொழி ஆதரவு" : "Multi-language Support"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "ta"
                ? "ஆங்கிலம் மற்றும் தமிழில் கருத்துகளைச் சமர்ப்பிக்கவும்"
                : "Submit feedback in English and Tamil"}
            </p>
          </Card>

          <Card className="p-6 card-hover text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-bold mb-2">
              {language === "ta" ? "AI-இயங்கும் பகுப்பாய்வு" : "AI-Powered Analysis"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "ta"
                ? "உணர்வு மற்றும் தானியங்கு பரிந்துரைகளைப் பெறுங்கள்"
                : "Get sentiment and automated suggestions"}
            </p>
          </Card>

          <Card className="p-6 card-hover text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold mb-2">
              {language === "ta" ? "நேரடி பகுப்பாய்வு" : "Real-time Analytics"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "ta"
                ? "காட்சி அறிக்கைகள் மற்றும் நுண்ணறிவுகள்"
                : "Visual reports and insights"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;