import { Card, CardContent } from "@/components/ui/card";
import { GitCompare } from "lucide-react";

type DiffToken = {
  word: string;
  type: "unchanged" | "removed" | "added";
};

function diffWords(original: string, humanized: string): DiffToken[] {
  const origWords = original.split(/(\s+)/).filter((w) => w.trim());
  const humWords = humanized.split(/(\s+)/).filter((w) => w.trim());

  // Limit for performance
  const MAX = 300;
  const a = origWords.slice(0, MAX);
  const b = humWords.slice(0, MAX);

  const m = a.length;
  const n = b.length;

  // LCS DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack
  const result: DiffToken[] = [];
  let i = m,
    j = n;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      a[i - 1].toLowerCase() === b[j - 1].toLowerCase()
    ) {
      result.unshift({ word: b[j - 1], type: "unchanged" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ word: b[j - 1], type: "added" });
      j--;
    } else {
      result.unshift({ word: a[i - 1], type: "removed" });
      i--;
    }
  }

  return result;
}

function tokenStyle(type: DiffToken["type"]) {
  switch (type) {
    case "added":
      return "bg-green-100 text-green-800 rounded px-0.5 mx-0.5";
    case "removed":
      return "bg-red-100 text-red-700 line-through rounded px-0.5 mx-0.5 opacity-70";
    default:
      return "mx-0.5";
  }
}

interface DiffViewProps {
  originalText: string;
  humanizedText: string;
}

export function DiffView({ originalText, humanizedText }: DiffViewProps) {
  if (!originalText || !humanizedText) return null;

  const tokens = diffWords(originalText, humanizedText);

  const added = tokens.filter((t) => t.type === "added").length;
  const removed = tokens.filter((t) => t.type === "removed").length;
  const unchanged = tokens.filter((t) => t.type === "unchanged").length;
  const total = added + removed + unchanged;
  const changePercent = total > 0 ? Math.round(((added + removed) / total) * 100) : 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="pt-5 pb-5">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <GitCompare className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Sentence-Level Diff</h3>
              <p className="text-xs text-muted-foreground">
                What Gemini changed in your text
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="ml-auto flex items-center gap-3 text-xs flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-green-200 border border-green-400" />
              <span className="font-medium text-green-700">+{added} added</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-red-200 border border-red-400" />
              <span className="font-medium text-red-700">-{removed} removed</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-muted border border-muted-foreground/30" />
              <span className="text-muted-foreground">{unchanged} unchanged</span>
            </span>
            <span className="font-semibold text-primary border-l pl-3">
              {changePercent}% rewritten
            </span>
          </div>
        </div>

        {/* Diff Text */}
        <div className="rounded-xl border bg-white/60 p-4 max-h-64 overflow-y-auto text-sm leading-7">
          <p className="whitespace-pre-wrap break-words">
            {tokens.map((token, idx) => (
              <span key={idx} className={tokenStyle(token.type)}>
                {token.word}
              </span>
            ))}
          </p>
        </div>

        {/* Legend */}
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>
            <span className="bg-green-100 text-green-800 rounded px-1">green</span> = new words
          </span>
          <span>
            <span className="bg-red-100 text-red-700 line-through rounded px-1">red</span> = removed words
          </span>
          <span>plain = unchanged</span>
        </div>
      </CardContent>
    </Card>
  );
}
