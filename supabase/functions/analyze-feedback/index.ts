import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language } = await req.json();
    
    if (!text) {
      throw new Error("Text is required");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing feedback:", { language, textLength: text.length });

    // Call Lovable AI for sentiment analysis and response generation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a professional feedback analyst. Analyze the given feedback and provide:
1. Sentiment classification (positive, negative, or neutral)
2. Sentiment score (0.0 to 1.0, where 0 is very negative and 1 is very positive)
3. Key positive keywords (as array)
4. Key negative keywords (as array)
5. A polite, empathetic response acknowledging the feedback
6. Constructive suggestions for improvement

The feedback may be in English or Tamil. Respond in the same language as the input.
Format your response as JSON with these exact keys: sentiment, sentimentScore, positiveKeywords, negativeKeywords, response, suggestions`
          },
          {
            role: "user",
            content: `Analyze this feedback: "${text}"\n\nLanguage: ${language}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API error: ${errorText}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    // Parse the AI response
    let analysisResult;
    try {
      const content = aiResponse.choices[0].message.content;
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Provide default analysis if parsing fails
      analysisResult = {
        sentiment: "neutral",
        sentimentScore: 0.5,
        positiveKeywords: [],
        negativeKeywords: [],
        response: language === "ta" 
          ? "உங்கள் கருத்துக்கு நன்றி. நாங்கள் இதை கவனமாக பரிசீலிப்போம்."
          : "Thank you for your feedback. We will carefully consider this.",
        suggestions: language === "ta"
          ? "உங்கள் அனுபவத்தை மேம்படுத்த தொடர்ந்து முயற்சிக்கிறோம்."
          : "We are continuously working to improve your experience."
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-feedback:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});