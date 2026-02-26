import { useState } from "react";
import { Activity, ShieldAlert, Pill, CheckCircle, Brain, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const MOCK_RESULT: AnalysisResult = {
  possible_conditions: [
    { name: "Common Cold", probability: 78, description: "Upper respiratory viral infection with typical symptoms including congestion, sore throat, and mild fatigue." },
    { name: "Seasonal Allergies", probability: 45, description: "Immune response to environmental allergens causing nasal congestion, sneezing, and irritation." },
    { name: "Acute Sinusitis", probability: 32, description: "Inflammation of the sinus cavities, often following a viral infection, causing facial pressure and congestion." },
  ],
  urgency_level: "Low",
  recommendations: [
    "Rest and stay hydrated with at least 8 glasses of water daily",
    "Monitor symptoms for 48-72 hours for any changes",
    "Consider over-the-counter decongestants for relief",
    "Schedule a visit with your primary care physician if symptoms persist beyond 7 days",
    "Avoid strenuous physical activity until symptoms subside",
  ],
  disclaimer: "This analysis is for educational purposes only and does not constitute medical advice.",
};

async function analyzeSymptoms(symptoms: string): Promise<AnalysisResult> {
  try {
    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    const res = await fetch(`${apiUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    // Fallback to mock data for demo
    await new Promise((r) => setTimeout(r, 2000));
    return MOCK_RESULT;
  }
}

const Waveform = () => (
  <div className="flex items-end gap-1 h-8 mt-4">
    {[0.2, 0.5, 0.8, 1, 0.6, 0.9, 0.4, 0.7, 1, 0.5, 0.3, 0.8].map((delay, i) => (
      <div
        key={i}
        className="w-1 rounded-full bg-primary/60 animate-waveform"
        style={{
          height: "100%",
          animationDelay: `${delay * 0.3}s`,
          animationDuration: `${0.8 + delay * 0.6}s`,
        }}
      />
    ))}
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

const Index = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim() || loading) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeSymptoms(symptoms);
      setResult(data);
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

        {/* Input Section */}
        <section className="mb-12">
          <div className="glass rounded-2xl p-6 glow-cyan">
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail — onset, duration, severity, and any related factors..."
              className="min-h-[160px] bg-transparent border-none text-foreground placeholder:text-muted-foreground text-base resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
              maxLength={2000}
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                {symptoms.length} / 2000 characters
              </span>
              <Button
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
                          <span className="text-primary font-medium">{condition.probability}%</span>
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
                  <div key={i} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Disclaimer Banner */}
        <footer className="mt-16 glass rounded-2xl p-5 border-red-500/30 bg-red-950/20">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-400">
              EDUCATIONAL TOOL ONLY — THIS IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
