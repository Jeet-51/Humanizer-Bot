import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, Bot } from "lucide-react";

function calculateAIScore(text: string): number {
  if (!text || text.trim().length < 20) return 0;

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return 0;

  // 1. Burstiness — AI writes uniformly-lengthed sentences (low variance = high AI score)
  //    CV threshold raised to 0.65 so that moderately-varied AI text is still flagged.
  const lengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, l) => sum + Math.pow(l - avg, 2), 0) / lengths.length;
  const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
  const burstinessScore = Math.min(1, cv / 0.65); // 1 = human-like, 0 = AI-like

  // 2. AI signature words — expanded list catches Gemini's preferred substitutions
  const aiWords = new Set([
    // Transitional connectors
    "furthermore", "moreover", "additionally", "consequently",
    "nevertheless", "therefore", "thus", "hence", "subsequently",
    "notably", "importantly", "evidently", "undoubtedly",
    // Corporate / buzzword verbs
    "utilize", "utilization", "facilitate", "implement", "leverage",
    "streamline", "optimize", "prioritize", "spearhead", "underscore",
    "foster", "cultivate", "harness", "catalyze", "revolutionize",
    "empower", "enable", "enhance", "ensure", "address",
    // AI-favourite adjectives / adverbs
    "robust", "comprehensive", "imperative", "crucial", "significant",
    "substantial", "optimal", "innovative", "seamlessly", "holistic",
    "scalable", "dynamic", "proactive", "actionable", "transformative",
    "pivotal", "groundbreaking", "multifaceted", "nuanced", "inherent",
    "vital", "paramount", "indispensable", "exemplary", "commendable",
    // AI-favourite nouns
    "paradigm", "synergy", "ecosystem", "landscape", "framework",
    "infrastructure", "stakeholder", "delve", "realm", "tapestry",
  ]);
  const aiWordCount = words.filter((w) => aiWords.has(w)).length;
  // Raised multiplier: 3+ AI words per 100 = fully flagged (was 4+)
  const aiWordScore = 1 - Math.min(1, (aiWordCount / words.length) * 33);

  // 3. Vocabulary richness (type-token ratio) — less weight since AI can have high TTR too
  const uniqueWords = new Set(words).size;
  const ttr = uniqueWords / words.length;
  const richness = Math.min(1, ttr * 1.5);

  // 4. Avg sentence length — reduced weight (least reliable signal)
  const sentLenScore = avg > 20 ? Math.max(0, 1 - (avg - 20) / 20) : 1;

  // Weights: buzzwords dominate (55%), burstiness secondary (30%),
  //          richness (10%) and length (5%) as minor signals.
  const humanScore =
    burstinessScore * 0.30 +
    aiWordScore     * 0.55 +
    richness        * 0.10 +
    sentLenScore    * 0.05;

  return Math.min(100, Math.max(0, Math.round((1 - humanScore) * 100)));
}

function getScoreLabel(score: number) {
  if (score >= 70) return { label: "Likely AI", color: "text-red-500", bg: "bg-red-500" };
  if (score >= 40) return { label: "Mixed", color: "text-yellow-500", bg: "bg-yellow-500" };
  return { label: "Human-like", color: "text-green-500", bg: "bg-green-500" };
}

interface ScoreBarProps {
  score: number;
  label: string;
  animated?: boolean;
}

function ScoreBar({ score, label, animated }: ScoreBarProps) {
  const [displayed, setDisplayed] = useState(0);
  const meta = getScoreLabel(score);

  useEffect(() => {
    if (!animated) { setDisplayed(score); return; }
    setDisplayed(0);
    const timer = setTimeout(() => {
      let current = 0;
      const step = score / 40;
      const interval = setInterval(() => {
        current = Math.min(score, current + step);
        setDisplayed(Math.round(current));
        if (current >= score) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [score, animated]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-bold ${meta.color}`}>{displayed}%</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color} bg-opacity-10 border border-current`}>
            {meta.label}
          </span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${meta.bg}`}
          style={{ width: `${displayed}%` }}
        />
      </div>
    </div>
  );
}

interface AIScoreMeterProps {
  originalText: string;
  humanizedText: string;
}

export function AIScoreMeter({ originalText, humanizedText }: AIScoreMeterProps) {
  if (!originalText || !humanizedText) return null;

  const beforeScore = calculateAIScore(originalText);
  const afterScore = calculateAIScore(humanizedText);
  const improvement = beforeScore - afterScore;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Detection Score</h3>
            <p className="text-xs text-muted-foreground">
              Lower % = less detectable as AI
            </p>
          </div>
          {improvement >= 3 && (
            <div className="ml-auto flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-full px-3 py-1">
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                -{improvement}% AI detected
              </span>
            </div>
          )}
          {improvement > -3 && improvement < 3 && (
            <div className="ml-auto flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-full px-3 py-1">
              <ShieldAlert className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">Similar score</span>
            </div>
          )}
          {improvement <= -3 && (
            <div className="ml-auto flex items-center gap-1.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-full px-3 py-1">
              <ShieldAlert className="h-4 w-4 text-red-500 dark:text-red-400" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-300">Score worsened</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <ScoreBar score={beforeScore} label="Before Humanizing" animated />
          </div>
          <div className="space-y-1">
            <ScoreBar score={afterScore} label="After Humanizing" animated />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
