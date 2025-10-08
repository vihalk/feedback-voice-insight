import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  language: string;
  onTranscript: (text: string) => void;
}

export const VoiceInput = ({ language, onTranscript }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === "ta" ? "ta-IN" : "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      toast({
        title: "Error",
        description: `Voice recognition error: ${event.error}`,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, toast, isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript) {
        onTranscript(transcript);
        setTranscript("");
      }
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: language === "ta" ? "பதிவு செய்யப்படுகிறது" : "Recording Started",
        description: language === "ta" ? "பேசத் தொடங்குங்கள்..." : "Start speaking...",
      });
    }
  };

  return (
    <Card className="p-8 text-center space-y-6 card-hover">
      <div className="flex flex-col items-center gap-4">
        <div className={`relative ${isRecording ? "animate-pulse" : ""}`}>
          <Button
            size="lg"
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`h-24 w-24 rounded-full ${
              isRecording
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </Button>
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping opacity-75" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {isRecording
              ? language === "ta"
                ? "கேட்டுக்கொண்டிருக்கிறது..."
                : "Listening..."
              : language === "ta"
              ? "பதிவைத் தொடங்க கிளிக் செய்க"
              : "Click to Start Recording"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "ta"
              ? "உங்கள் கருத்தை சொல்லுங்கள்"
              : "Speak your feedback"}
          </p>
        </div>
      </div>

      {transcript && (
        <div className="p-4 bg-muted rounded-lg text-left">
          <p className="text-sm font-medium mb-2">
            {language === "ta" ? "டிரான்ஸ்கிரிப்ட்:" : "Transcript:"}
          </p>
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </Card>
  );
};