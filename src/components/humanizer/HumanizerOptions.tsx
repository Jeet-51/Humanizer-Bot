import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HumanizerOptionsProps {
  readability: string;
  setReadability: (value: string) => void;
  purpose: string;
  setPurpose: (value: string) => void;
  strength: number;
  setStrength: (value: number) => void;
}

const VOICE_OPTIONS = [
  { value: "Student",    emoji: "🎓", label: "Student",       desc: "Clear, essay-quality prose" },
  { value: "CEO",        emoji: "💼", label: "CEO",            desc: "Authoritative & decisive" },
  { value: "Journalist", emoji: "📰", label: "Journalist",     desc: "Sharp, punchy & direct" },
  { value: "Researcher", emoji: "🔬", label: "Researcher",     desc: "Precise & analytical" },
  { value: "Novelist",   emoji: "✍️", label: "Novelist",       desc: "Expressive & vivid" },
  { value: "Casual",     emoji: "💬", label: "Casual Human",   desc: "Warm & conversational" },
];

const CONTENT_OPTIONS = [
  { value: "General Article",    emoji: "📝", label: "General Article",     desc: "Balanced, informative" },
  { value: "Academic Paper",     emoji: "🎓", label: "Academic Paper",      desc: "Formal & structured" },
  { value: "Professional Email", emoji: "📧", label: "Professional Email",  desc: "Concise & action-ready" },
  { value: "Social Media",       emoji: "📱", label: "Social Media",        desc: "Punchy & shareable" },
  { value: "Marketing Copy",     emoji: "📣", label: "Marketing Copy",      desc: "Persuasive & benefit-driven" },
  { value: "Blog Post",          emoji: "💬", label: "Blog Post",           desc: "Friendly & engaging" },
];

export function HumanizerOptions({
  readability,
  setReadability,
  purpose,
  setPurpose,
  strength,
  setStrength,
}: HumanizerOptionsProps) {
  const strengthLabel =
    strength <= 0.3 ? "Light Touch" :
    strength <= 0.6 ? "Moderate" :
    strength <= 0.8 ? "Strong" : "Maximum";

  return (
    <div className="grid gap-5 py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Writing Voice */}
        <div className="space-y-2">
          <Label htmlFor="readability" className="text-sm font-semibold">
            Writing Voice
          </Label>
          <Select value={readability} onValueChange={setReadability}>
            <SelectTrigger id="readability" className="h-11">
              <SelectValue placeholder="Choose a voice…" />
            </SelectTrigger>
            <SelectContent>
              {VOICE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Type */}
        <div className="space-y-2">
          <Label htmlFor="purpose" className="text-sm font-semibold">
            Content Type
          </Label>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger id="purpose" className="h-11">
              <SelectValue placeholder="Choose content type…" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.desc}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Strength Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="strength" className="text-sm font-semibold">
            Humanization Strength
          </Label>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: strength >= 0.7 ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.08)",
              color: "#7C3AED",
              border: "1px solid rgba(139,92,246,0.25)",
            }}>
            {strengthLabel} · {strength}
          </span>
        </div>
        <Slider
          id="strength"
          value={[strength]}
          min={0.1}
          max={0.9}
          step={0.1}
          onValueChange={(values) => setStrength(values[0])}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Light Touch</span>
          <span>Maximum</span>
        </div>
      </div>
    </div>
  );
}
