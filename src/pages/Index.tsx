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
import { HeroIllustration } from "@/components/HeroIllustration";
import { FeatureCard } from "@/components/FeatureCard";
import { Languages, BarChart3, MessageSquare, Sparkles, Mic, Brain, TrendingUp, Zap, Globe, Shield } from "lucide-react";

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
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Sentiment Analysis</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold gradient-text leading-tight">
              {language === "ta"
                ? "கருத்து உணர்வு பகுப்பாய்வி"
                : "Feedback Sentiment Analyzer"}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === "ta"
                ? "AI-இயங்கும் பகுப்பாய்வு மூலம் உங்கள் குரலை உரையாக மாற்றவும், உணர்வுகளைப் புரிந்துகொள்ளவும் மற்றும் நுண்ணறிவுகளைப் பெறவும்"
                : "Transform your voice to text, understand sentiments, and get insights with AI-powered analysis"}
            </p>

            <div className="max-w-4xl mx-auto mt-8">
              <HeroIllustration />
            </div>

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
      <div className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {language === "ta" ? "சக்திவாய்ந்த அம்சங்கள்" : "Powerful Features"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {language === "ta" 
              ? "உங்கள் கருத்துப் பகுப்பாய்வை அடுத்த நிலைக்கு எடுத்துச் செல்லுங்கள்"
              : "Take your feedback analysis to the next level"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <FeatureCard 
            icon={Mic}
            title={language === "ta" ? "குரல் உள்ளீடு" : "Voice Input"}
            description={language === "ta" 
              ? "பேசவும், உடனடியாக உரையாக மாற்றவும்" 
              : "Speak and convert to text instantly"}
            gradient="from-primary to-secondary"
          />
          
          <FeatureCard 
            icon={Globe}
            title={language === "ta" ? "பல மொழி ஆதரவு" : "Multi-language Support"}
            description={language === "ta"
              ? "ஆங்கிலம் மற்றும் தமிழில் கருத்துகளை சமர்ப்பிக்கவும்"
              : "Submit feedback in English and Tamil"}
            gradient="from-secondary to-accent"
          />
          
          <FeatureCard 
            icon={Brain}
            title={language === "ta" ? "AI பகுப்பாய்வு" : "AI Analysis"}
            description={language === "ta"
              ? "உணர்வுகளைப் புரிந்துகொள்ளவும் மற்றும் பரிந்துரைகளைப் பெறவும்"
              : "Understand sentiments and get suggestions"}
            gradient="from-accent to-primary"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={TrendingUp}
            title={language === "ta" ? "நேரடி பகுப்பாய்வு" : "Real-time Analytics"}
            description={language === "ta"
              ? "காட்சி அறிக்கைகள் மற்றும் நுண்ணறிவுகள்"
              : "Visual reports and insights"}
            gradient="from-primary to-accent"
          />
          
          <FeatureCard 
            icon={Zap}
            title={language === "ta" ? "உடனடி பதில்கள்" : "Instant Responses"}
            description={language === "ta"
              ? "AI-இயங்கும் நேரடி பதில்கள் மற்றும் ஆலோசனைகள்"
              : "Get AI-powered instant responses and advice"}
            gradient="from-secondary to-primary"
          />
          
          <FeatureCard 
            icon={Shield}
            title={language === "ta" ? "பாதுகாப்பான" : "Secure & Private"}
            description={language === "ta"
              ? "உங்கள் தரவு பாதுகாப்பாகவும் தனிப்பட்டதாகவும் உள்ளது"
              : "Your data is secure and private"}
            gradient="from-accent to-secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;