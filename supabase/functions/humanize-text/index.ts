import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_READABILITY_LEVELS = ["High School", "University", "Doctorate", "Journalist", "Marketing"];
const VALID_PURPOSES = ["General Writing", "Academic", "Business", "Creative", "Technical"];
const DEFAULT_READABILITY = "University";
const DEFAULT_PURPOSE = "General Writing";
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

  const validatedReadability = readability && VALID_READABILITY_LEVELS.includes(readability)
    ? readability : DEFAULT_READABILITY;

  const validatedPurpose = purpose && VALID_PURPOSES.includes(purpose)
    ? purpose : DEFAULT_PURPOSE;

  const parsedStrength = parseFloat(strength);
  const validatedStrength = !isNaN(parsedStrength) && parsedStrength >= 0.1 && parsedStrength <= 0.9
    ? parsedStrength : DEFAULT_STRENGTH;

  return { text, validatedReadability, validatedPurpose, validatedStrength };
}

function buildReadabilityPrompt(readability: string): string {
  switch (readability) {
    case "High School":
      return "Use simple everyday vocabulary. Short punchy sentences. Nothing fancy.";
    case "University":
      return "Use clear, educated language — intelligent but not stiff or overly formal.";
    case "Doctorate":
      return "Use sophisticated academic vocabulary, but write like a real expert who thinks clearly — not like a robot quoting a textbook.";
    case "Journalist":
      return "Write like a journalist: crisp, direct, punchy. Hook the reader. Vary sentence length dramatically.";
    case "Marketing":
      return "Write like a human copywriter: persuasive, energetic, relatable. Use second-person, real benefits, and a conversational tone.";
    default:
      return "Use clear, natural language that sounds like an educated person wrote it.";
  }
}

function buildPurposePrompt(purpose: string): string {
  switch (purpose) {
    case "Academic":
      return "Tone: scholarly but genuine. Sound like a student who actually understands the topic, not a language model summarizing papers.";
    case "Business":
      return "Tone: professional but human. Imagine a smart colleague explaining something — direct, clear, no corporate fluff.";
    case "Creative":
      return "Tone: vivid and personal. Use imagery, vary rhythm, let some sentences be very short. Make it feel alive.";
    case "Technical":
      return "Tone: precise and confident. Sound like an engineer who knows their craft — clear explanations, no padding.";
    default:
      return "Tone: natural and conversational, like a knowledgeable person talking to a friend.";
  }
}

function buildStrengthPrompt(strength: number): string {
  if (strength < 0.3) {
    return "Make light edits: fix only the most robotic phrases. Keep most of the original wording intact.";
  } else if (strength < 0.6) {
    return "Moderate rewrite: change sentence structure and swap out AI-sounding words, but keep the core ideas close to the original.";
  } else {
    return "Full rewrite: completely restructure the text. Change sentence order, break up long sentences, merge short ones, rephrase everything. The final result should share the same meaning but read like a completely different writer wrote it from scratch.";
  }
}

function buildHumanizationPrompt(readability: string, purpose: string, strength: number): string {
  const readabilityGuide = buildReadabilityPrompt(readability);
  const purposeGuide = buildPurposePrompt(purpose);
  const strengthGuide = buildStrengthPrompt(strength);

  return `You are a professional human editor who rewrites AI-generated text so it passes AI detection tools like GPTZero, Turnitin, and Originality.ai.

READABILITY TARGET: ${readabilityGuide}
PURPOSE: ${purposeGuide}
REWRITE DEPTH: ${strengthGuide}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL RULES — FOLLOW EVERY ONE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. BANNED WORDS — never use any of these, even once:
   furthermore, moreover, additionally, consequently, nevertheless,
   therefore, thus, hence, subsequently, notably, importantly,
   utilize, utilization, facilitate, leverage, implement, streamline,
   optimize, prioritize, spearhead, underscore, foster, cultivate,
   harness, catalyze, revolutionize, empower, delve, realm, tapestry,
   paradigm, synergy, ecosystem, landscape, framework, infrastructure,
   stakeholder, robust, comprehensive, imperative, crucial, optimal,
   innovative, seamlessly, holistic, scalable, dynamic, proactive,
   actionable, transformative, pivotal, groundbreaking, multifaceted,
   nuanced, inherent, vital, paramount, indispensable, commendable,
   significant, substantial, cutting-edge, state-of-the-art

2. SENTENCE VARIETY — this is the #1 AI tell. Mix it up hard:
   - Follow a long sentence with a very short one. Like this.
   - Use fragments occasionally for emphasis. Really.
   - Vary between 6-word and 35-word sentences randomly.
   - Start sentences differently: with "But", "So", "Yet", "The thing is,", "Here's the deal —"

3. SOUND HUMAN:
   - Use contractions: don't, can't, it's, they're, you'll
   - Add a relatable aside or observation now and then
   - Avoid starting every sentence with "The" or a noun — mix it up
   - Replace formal transitions with casual ones: "On top of that" not "Furthermore"
   - Use specific numbers or details instead of vague superlatives

4. STRUCTURE CHANGES:
   - Break long uniform paragraphs into shorter chunks
   - If the original has 5 sentences all the same length, make the rewrite have 3 short + 2 long
   - Move ideas around if it makes the writing flow more naturally

5. PRESERVE meaning — same facts, same argument, same information. Just rewritten.

6. OUTPUT — return ONLY the rewritten text. No preamble, no explanation, no "[", no "]".`;
}

async function callGeminiHumanization(text: string, readability: string, purpose: string, strength: number) {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured. Please contact support.");
  }

  const systemPrompt = buildHumanizationPrompt(readability, purpose, strength);
  // Higher temperature for more creative, less predictable outputs
  const temperature = 0.4 + (strength * 0.6);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [{
          parts: [{ text: `Rewrite this text following all the rules above:\n\n${text}` }]
        }],
        generationConfig: {
          temperature,
          maxOutputTokens: 2048,
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

  console.log("Successfully humanized text using Gemini");
  return humanizedText;
}

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

    const { text, validatedReadability, validatedPurpose, validatedStrength } = validateAndParseRequest(requestBody);

    const humanizedText = await callGeminiHumanization(text, validatedReadability, validatedPurpose, validatedStrength);

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
