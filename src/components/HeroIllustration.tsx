import { Sparkles, MessageCircle, Smile } from "lucide-react";

export const HeroIllustration = () => {
  return (
    <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-primary/10 shadow-lg overflow-hidden relative">
      {/* Floating orbs */}
      <div className="absolute -left-10 top-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -right-16 -bottom-8 w-48 h-48 rounded-full bg-secondary/20 blur-3xl" />

      {/* Content */}
      <div className="relative h-full flex flex-col md:flex-row items-center justify-between px-8 md:px-10 gap-6">
        {/* Left side: voice waves */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/60 border border-border/40 text-xs font-medium w-max">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Real-time AI Sentiment</span>
          </div>

          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Voice waves converted into rich text</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="w-4 h-4 text-secondary" />
              <span>AI highlights key phrases and topics</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Smile className="w-4 h-4 text-accent" />
              <span>Sentiment mapped from negative to positive</span>
            </div>
          </div>
        </div>

        {/* Right side: sentiment bars */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {["Negative", "Neutral", "Positive"].map((label, index) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl bg-background/70 border border-border/40 p-3 backdrop-blur-sm"
              >
                <div
                  className={`w-full rounded-full h-20 overflow-hidden bg-muted flex items-end ${
                    index === 0
                      ? "[&>div]:bg-destructive/80"
                      : index === 1
                      ? "[&>div]:bg-secondary/80"
                      : "[&>div]:bg-primary/80"
                  }`}
                >
                  <div
                    className="w-full rounded-full transition-all duration-700"
                    style={{
                      height: index === 0 ? "35%" : index === 1 ? "55%" : "85%",
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
