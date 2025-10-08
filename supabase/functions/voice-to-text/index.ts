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
    const { audioData, language } = await req.json();
    
    if (!audioData) {
      throw new Error("Audio data is required");
    }

    console.log("Processing voice to text:", { language });

    // For now, return a mock response since we're using browser's Web Speech API
    // This endpoint can be extended with Whisper API if needed
    return new Response(
      JSON.stringify({ 
        text: "Voice recognition is handled by the browser's Web Speech API",
        success: true 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in voice-to-text:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});