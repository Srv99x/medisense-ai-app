import { useState, useEffect } from "react";
import {
  Activity,
  ShieldAlert,
  Pill,
  CheckCircle,
  Brain,
  AlertTriangle,
  Loader2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Condition {
  name: string;
  probability: number;
  description: string;
}

interface AnalysisResult {
  possible_conditions: Condition[];
  urgency_level: "Low" | "Medium" | "High";
  recommendations: string[];
  disclaimer: string;
}

// ---------------------------------------------------------------------------
// API helper
// SECURITY NOTE: The catch block no longer silently falls back to mock data.
// Network or server errors are surfaced to the user as a visible error state,
// so they know the AI analysis did NOT succeed.
// ---------------------------------------------------------------------------
async function analyzeSymptoms(symptoms: string): Promise<AnalysisResult> {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  const res = await fetch(`${apiUrl}/api/v1/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });

  if (!res.ok) {
    // Try to get the server's error message; fall back to a generic one.
    let detail = "An error occurred. Please try again.";
    try {
      const errorBody = await res.json();
      if (errorBody?.detail) detail = String(errorBody.detail);
    } catch {
      // ignore parse failure
    }
    if (res.status === 429) {
      detail =
        "Too many requests — you have reached the analysis limit. Please wait a minute and try again.";
    }
    throw new Error(detail);
  }

  return res.json();
}

// Ping the backend health-check endpoint so the HF Space wakes up.
async function pingBackend(): Promise<boolean> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    const res = await fetch(`${apiUrl}/`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const Waveform = () => (
  <div className="flex items-end gap-1 h-8 mt-4">
    {[0.2, 0.5, 0.8, 1, 0.6, 0.9, 0.4, 0.7, 1, 0.5, 0.3, 0.8].map(
      (delay, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-primary/60 animate-waveform"
          style={{
            height: "100%",
            animationDelay: `${delay * 0.3}s`,
            animationDuration: `${0.8 + delay * 0.6}s`,
          }}
        />
      )
    )}
  </div>
);

const UrgencyBadge = ({ level }: { level: string }) => {
  const config: Record<string, string> = {
    High: "bg-danger/20 text-red-400 border-red-500/50 animate-pulse-glow",
    Medium: "bg-warning/20 text-amber-400 border-amber-500/50",
    Low: "bg-success/20 text-emerald-400 border-emerald-500/50",
  };

  return (
    <Badge className={`text-sm px-4 py-1.5 border ${config[level] || config.Low}`}>
      <AlertTriangle className="w-4 h-4 mr-1.5" />
      {level} Urgency
    </Badge>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const Index = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendReady, setBackendReady] = useState<"unknown" | "warming" | "ready">("unknown");

  // Ping the backend on page load so the HF Space wakes up from sleep.
  // Free-tier HF Spaces sleep after ~30 min of inactivity.
  useEffect(() => {
    setBackendReady("warming");
    pingBackend().then((ok) => {
      setBackendReady(ok ? "ready" : "warming");
      // If still not ready, keep retrying every 5 seconds for up to 60s.
      if (!ok) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const alive = await pingBackend();
          if (alive || attempts >= 12) {
            clearInterval(interval);
            setBackendReady(alive ? "ready" : "ready"); // proceed regardless after 60s
          }
        }, 5000);
      }
    });
  }, []);

  const handleAnalyze = async () => {
    if (!symptoms.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await analyzeSymptoms(symptoms);
      setResult(data);
    } catch (err: unknown) {
      // Surface the error visibly so the user knows the real AI call failed.
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
              Neural Diagnostics Engine
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-gradient-glow mb-4">
            MediSense AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Advanced Neural Symptom Analysis
          </p>
          <div className="flex justify-center">
            <Waveform />
          </div>
        </header>

        {/* Warm-up banner: shown while backend is waking */}
        {backendReady === "warming" && (
          <div
            className="mb-6 glass rounded-2xl p-3 border border-primary/30 bg-primary/5 flex items-center gap-3"
            role="status"
          >
            <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            <p className="text-sm text-primary/80">
              <span className="font-semibold">Warming up neural engine…</span>{" "}
              The AI backend is starting from sleep — this takes ~30 seconds on
              first load. Analysis will be available shortly.
            </p>
          </div>
        )}

        {/* === ALWAYS-VISIBLE DISCLAIMER (before submit) === */}
        {/* SECURITY FIX: Shown unconditionally so every user sees it before
            interacting, not only after they submit a query. */}
        <div
          className="mb-8 glass rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20 flex items-start gap-3"
          role="note"
          aria-label="Medical disclaimer"
        >
          <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300/90 leading-relaxed">
            <span className="font-bold">For educational use only.</span> MediSense AI
            is an AI tool that does{" "}
            <span className="font-semibold">not</span> provide medical advice,
            diagnosis, or treatment. Always consult a qualified healthcare
            professional for medical concerns.
          </p>
        </div>

        {/* Input Section */}
        <section className="mb-12">
          <div className="glass rounded-2xl p-6 glow-cyan">
            <Textarea
              id="symptoms-input"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail — onset, duration, severity, and any related factors..."
              className="min-h-[160px] bg-transparent border-none text-foreground placeholder:text-muted-foreground text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
              maxLength={2000}
              aria-label="Symptom description"
              aria-describedby="char-count"
            />
            <div className="flex items-center justify-between mt-4">
              <span id="char-count" className="text-xs text-muted-foreground">
                {symptoms.length} / 2000 characters
              </span>
              <Button
                id="analyze-button"
                onClick={handleAnalyze}
                disabled={loading || !symptoms.trim()}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold px-8 py-5 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-40"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Neural Data...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Initialize AI Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* === ERROR STATE === */}
        {/* SECURITY FIX: Replaced silent mock-data fallback with a visible error. */}
        {error && (
          <section
            className="mb-8 glass rounded-2xl p-5 border border-red-500/40 bg-red-950/20 flex items-start gap-3 animate-fade-in"
            role="alert"
            aria-live="assertive"
          >
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-400">Analysis Failed</p>
              <p className="text-sm text-red-300/80 mt-1">{error}</p>
            </div>
          </section>
        )}

        {/* Results Dashboard */}
        {result && (
          <section className="space-y-8 animate-fade-in">
            {/* Urgency */}
            <div className="flex justify-center">
              <UrgencyBadge level={result.urgency_level} />
            </div>

            {/* Conditions Grid */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Possible Conditions
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.possible_conditions.map((condition, i) => (
                  <Card
                    key={i}
                    className="glass border-white/10 hover:-translate-y-1 hover:glow-border-cyan transition-all duration-300"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-foreground">
                        {condition.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Probability bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Probability</span>
                          <span className="text-primary font-medium">
                            {condition.probability}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                            style={{ width: `${condition.probability}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {condition.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" />
                Care Protocols
              </h2>
              <div className="glass rounded-2xl p-6 space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-result disclaimer (from server, canonical text injected backend-side) */}
            {result.disclaimer && (
              <div className="glass rounded-2xl p-4 border border-amber-500/30 bg-amber-950/10 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/80 leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Persistent footer disclaimer */}
        <footer className="mt-16 glass rounded-2xl p-5 border-red-500/30 bg-red-950/20">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-400">
              EDUCATIONAL TOOL ONLY — THIS IS NOT A SUBSTITUTE FOR PROFESSIONAL
              MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
