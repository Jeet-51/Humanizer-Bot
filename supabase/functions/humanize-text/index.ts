import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── New option sets ───────────────────────────────────────────────────────────
const VALID_VOICES  = ["Student", "CEO", "Journalist", "Researcher", "Novelist", "Casual"];
const VALID_CONTENT = ["General Article", "Academic Paper", "Professional Email", "Social Media", "Marketing Copy", "Blog Post"];
const DEFAULT_VOICE   = "Student";
const DEFAULT_CONTENT = "General Article";
const DEFAULT_STRENGTH = 0.9;

function handleCorsPreflightRequest() {
  return new Response(null, { headers: corsHeaders });
}

function validateAndParseRequest(requestBody: any) {
  const { text, readability, purpose, strength } = requestBody;

  if (!text || typeof text !== "string") {
    throw new Error("Text parameter is required and must be a string");
  }
  if (text.length < 50) {
    throw new Error("Text must be at least 50 characters long");
  }

  const validatedVoice = readability && VALID_VOICES.includes(readability)
    ? readability : DEFAULT_VOICE;

  const validatedContent = purpose && VALID_CONTENT.includes(purpose)
    ? purpose : DEFAULT_CONTENT;

  const parsedStrength = parseFloat(strength);
  const validatedStrength = !isNaN(parsedStrength) && parsedStrength >= 0.1 && parsedStrength <= 0.9
    ? parsedStrength : DEFAULT_STRENGTH;

  return { text, validatedVoice, validatedContent, validatedStrength };
}

// ── Voice (writing persona) prompts ──────────────────────────────────────────
function buildVoicePrompt(voice: string): string {
  const voices: Record<string, string> = {
    "Student":
      "Write like a sharp, well-read college student who genuinely understands the topic. " +
      "Clear structure, intelligent vocabulary, confident sentences — but not stiff or overly formal. " +
      "Sounds like someone who did the research and thought it through, not like a textbook.",

    "CEO":
      "Write like a senior executive with real authority. Get to the point in the first sentence. " +
      "Short paragraphs. Decisive, active-voice statements. No hedging, no filler. " +
      "Every sentence earns its place. Sounds like someone whose time is valuable and who knows exactly what they want to say.",

    "Journalist":
      "Write like a veteran journalist. Lead with the most important point immediately. " +
      "Short punchy sentences mixed with longer explanatory ones. Strong active verbs. " +
      "Avoid passive voice. Make the reader want to read the next sentence. " +
      "Crisp, clear, compelling — like a well-edited newspaper piece.",

    "Researcher":
      "Write like an expert who has actually studied this deeply. Precise, measured language. " +
      "Acknowledge nuance where it exists. Methodical reasoning — each claim follows naturally from the last. " +
      "Sounds like a knowledgeable person explaining their findings to a smart peer, not reciting from a report.",

    "Novelist":
      "Write like a quality non-fiction author (think Malcolm Gladwell or Michael Lewis). " +
      "Varied sentence rhythm — short punchy ones for emphasis, flowing longer ones for explanation. " +
      "Specific, concrete language over vague generalities. Let the writing breathe. " +
      "Make it a pleasure to read, not just informative.",

    "Casual":
      "Write like a knowledgeable friend explaining this over coffee. " +
      "Contractions everywhere: it's, don't, can't, they're, you'll. " +
      "Conversational connectors: 'On top of that', 'The thing is', 'And here's what's interesting'. " +
      "Short sentences. Relatable. Warm. No corporate language whatsoever.",
  };

  return voices[voice] || voices["Student"];
}

// ── Content type prompts ──────────────────────────────────────────────────────
function buildContentPrompt(content: string): string {
  const types: Record<string, string> = {
    "General Article":
      "Format: flowing prose with clear paragraph breaks. " +
      "Balanced, informative, easy to follow from start to finish.",

    "Academic Paper":
      "Format: formal academic prose. Precise claims, hedged language where appropriate " +
      "('research suggests', 'evidence indicates'). Logical paragraph structure. " +
      "Sounds like a genuine scholar — not a robot paraphrasing sources.",

    "Professional Email":
      "Format: direct opening that states the purpose immediately. Short paragraphs. " +
      "Clear next steps or action items. Professional but human — not cold or bureaucratic. " +
      "Conclude cleanly without hollow phrases like 'please do not hesitate to contact me'.",

    "Social Media":
      "Format: hook in the very first sentence. Short sentences. Punchy, quotable lines. " +
      "Use line breaks generously. End with something that invites engagement or reflection. " +
      "Sounds like a real person with a point of view, not a brand account.",

    "Marketing Copy":
      "Format: lead with the key benefit — not the feature, the benefit. " +
      "Second-person ('you', 'your') to speak directly to the reader. " +
      "Short paragraphs, confident assertions, clear value proposition. " +
      "Persuasive but not salesy — sounds trustworthy, not pushy.",

    "Blog Post":
      "Format: friendly, engaging opener that pulls the reader in. " +
      "Short paragraphs (2-3 sentences max). Conversational asides are fine. " +
      "Scannable — a reader skimming should still get the key points. " +
      "End with a thought or takeaway that sticks.",
  };

  return types[content] || types["General Article"];
}

// ── Strength prompt ───────────────────────────────────────────────────────────
function buildStrengthGuide(strength: number): string {
  if (strength < 0.3) {
    return "LIGHT EDIT — change only the most obvious AI phrases. Keep 80%+ of the original wording intact.";
  } else if (strength < 0.6) {
    return "MODERATE REWRITE — rephrase sentences and swap AI words throughout, but keep ideas in the same order.";
  } else {
    return "FULL REWRITE — restructure sentences, vary lengths dramatically, rephrase everything naturally. " +
           "Same meaning, completely different expression. Match the original length — do not shorten.";
  }
}

// ── Master prompt builder ─────────────────────────────────────────────────────
function buildHumanizationPrompt(voice: string, content: string, strength: number): string {
  return `You are a professional editor who rewrites AI-generated text so it sounds authentically human and passes AI detectors like GPTZero, Turnitin, and Originality.ai.

WRITING VOICE: ${buildVoicePrompt(voice)}

CONTENT TYPE: ${buildContentPrompt(content)}

REWRITE DEPTH: ${buildStrengthGuide(strength)}

══════════════════════════════════════
NON-NEGOTIABLE RULES — FOLLOW ALL SIX
══════════════════════════════════════

RULE 1 — BANNED WORDS (never use, not even once):
furthermore, moreover, additionally, consequently, nevertheless,
therefore, thus, hence, subsequently, notably, importantly,
utilize, utilization, facilitate, leverage, streamline, spearhead,
underscore, cultivate, harness, catalyze, revolutionize, delve,
paradigm, synergy, ecosystem, framework, stakeholder,
robust, comprehensive, imperative, optimal, innovative,
seamlessly, holistically, scalable, proactive, actionable,
transformative, pivotal, groundbreaking, multifaceted, nuanced,
cutting-edge, state-of-the-art, game-changing, best-in-class

RULE 2 — SENTENCE VARIETY (the #1 AI detection signal):
Mix sentence lengths dramatically. Short sentences land hard. Then a longer explanatory sentence follows to give the idea room to breathe and connect to what comes next. Then short again.
Never write 4+ sentences of similar length in a row.

RULE 3 — NATURAL TRANSITIONS:
Replace all AI connector words with human ones:
✗ "Furthermore," → ✓ "On top of that," / "Beyond that," / "At the same time,"
✗ "Moreover," → ✓ "What's more," / "And" / just start a new sentence
✗ "Consequently," → ✓ "As a result," / "So," / "That means"
✗ "Additionally," → ✓ "Also," / "Plus," / "And"

RULE 4 — CONTENT PRESERVATION:
Preserve every fact, idea, and argument from the original. Do not omit anything.
Do not summarize or shorten — the output should be similar in length to the input.
Do not add new information that was not in the original.

RULE 5 — COMPLETE OUTPUT:
Write every sentence in full. Never end mid-thought.
If you start a sentence or section, finish it completely.

RULE 6 — OUTPUT FORMAT:
Return ONLY the rewritten text. No preamble, no explanation, no labels.
No "Here is the rewritten version:" or similar openers.`;
}

// ── Gemini API call ───────────────────────────────────────────────────────────
async function callGeminiHumanization(
  text: string,
  voice: string,
  content: string,
  strength: number
) {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured. Please contact support.");
  }

  const systemPrompt = buildHumanizationPrompt(voice, content, strength);
  const temperature = 0.3 + (strength * 0.5); // 0.35–0.75 range

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{
          parts: [{
            text: `Rewrite the following text according to all six rules. Preserve every idea. Complete every sentence. Match the original length:\n\n${text}`
          }]
        }],
        generationConfig: {
          temperature,
          maxOutputTokens: 4096,
        }
      })
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Gemini API error (${response.status}): ${errorBody}`);
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  const humanizedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!humanizedText || humanizedText.trim() === text.trim()) {
    throw new Error("The humanization service returned an invalid response. Please try again.");
  }

  console.log(`Successfully humanized — voice: ${voice}, content: ${content}`);
  return humanizedText;
}

// ── Server ────────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch {
      throw new Error("Invalid request body format. Expected JSON.");
    }

    const { text, validatedVoice, validatedContent, validatedStrength } =
      validateAndParseRequest(requestBody);

    const humanizedText = await callGeminiHumanization(
      text, validatedVoice, validatedContent, validatedStrength
    );

    return new Response(
      JSON.stringify({ humanizedText, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in humanize-text function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to humanize text", success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
