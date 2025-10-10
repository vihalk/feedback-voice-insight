import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const HeroIllustration = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateHeroImage = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-image", {
          body: { 
            prompt: "A modern, abstract illustration showing AI analyzing voice waves and text bubbles with sentiment indicators (happy, neutral, sad faces) in purple and vibrant colors. Professional, clean design with gradient background. Digital art style, 16:9 aspect ratio." 
          }
        });

        if (error) throw error;
        if (data?.imageUrl) {
          setImageUrl(data.imageUrl);
        }
      } catch (error) {
        console.error("Failed to generate hero image:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateHeroImage();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-64 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse">
        <Sparkles className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
      <img 
        src={imageUrl} 
        alt="AI Sentiment Analysis Illustration" 
        className="w-full h-full object-cover"
      />
    </div>
  );
};
