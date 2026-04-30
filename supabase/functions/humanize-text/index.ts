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

function buildStyleGuide(readability: string, purpose: string): string {
  const readabilityGuides: Record<string, string> = {
    "High School": "Write simply. Short sentences. Common everyday words. No jargon.",
    "University": "Write clearly and intelligently. Educated tone, not stiff. Sounds like a smart person explaining something well.",
    "Doctorate": "Write with depth and precision. Expert vocabulary used naturally, not to show off.",
    "Journalist": "Write crisply. Direct sentences. Strong verbs. Hook the reader fast.",
    "Marketing": "Write persuasively. Speak to benefits. Second-person where it fits. Confident and energetic.",
  };

  const purposeGuides: Record<string, string> = {
    "General Writing": "Conversational but coherent. Natural rhythm. Reads like a real person wrote it.",
    "Academic": "Formal but genuine. Sounds like a researcher who actually understands their topic deeply.",
    "Business": "Professional and direct. Like a competent colleague explaining something — no fluff, no slang.",
    "Creative": "Vivid and rhythmic. Vary the pace. Let the writing breathe.",
    "Technical": "Precise and confident. Clear step-by-step logic. No vague filler.",
  };

  return `Readability: ${readabilityGuides[readability] || readabilityGuides["University"]}
Purpose: ${purposeGuides[purpose] || purposeGuides["General Writing"]}`;
}

function buildStrengthGuide(strength: number): string {
  if (strength < 0.3) {
    return "LIGHT edit — fix only the most robotic phrases. Keep 80%+ of the original wording.";
  } else if (strength < 0.6) {
    return "MODERATE rewrite — change sentence structure and word choice throughout, but keep ideas in the same order.";
  } else {
    return "FULL rewrite — restructure sentences, vary lengths dramatically, rephrase everything. The result should share meaning with the original but sound like a completely different writer. Do NOT shorten — match the original length.";
  }
}

function buildHumanizationPrompt(readability: string, purpose: string, strength: number): string {
  const styleGuide = buildStyleGuide(readability, purpose);
  const strengthGuide = buildStrengthGuide(strength);

  return `You are a professional editor who rewrites AI-generated text so it sounds natural and human-written, passing AI detectors like GPTZero and Turnitin.

${styleGuide}
Rewrite depth: ${strengthGuide}

══════════════════════════════════
ABSOLUTE RULES — NEVER BREAK THESE
══════════════════════════════════

RULE 1 — NEVER USE THESE WORDS (not even once):
furthermore, moreover, additionally, consequently, nevertheless,
therefore, thus, hence, subsequently, notably, importantly,
utilize, utilization, facilitate, leverage, streamline, spearhead,
underscore, cultivate, harness, catalyze, revolutionize, delve,
paradigm, synergy, ecosystem, framework, stakeholder,
robust, comprehensive, imperative, optimal, innovative,
seamlessly, holistically, scalable, proactive, actionable,
transformative, pivotal, groundbreaking, multifaceted, nuanced,
cutting-edge, state-of-the-art, game-changing, best-in-class

RULE 2 — VARY SENTENCE LENGTH (most important structural rule):
- Do NOT write 5 sentences that are all the same length
- Mix short punchy sentences (under 10 words) with longer explanatory ones (20-30 words)
- Example rhythm: long sentence, short sentence. Medium. Long again. Short.

RULE 3 — NATURAL TRANSITIONS (replace AI connector words):
- NEVER start sentences with: "Furthermore," "Moreover," "Additionally," "Consequently,"
- USE instead: "On top of that," "At the same time," "Beyond that," "Still," "That said," "In practice,"
- Or simply connect ideas with "and," "but," "so," "yet" within sentences
- Use contractions naturally: it's, don't, can't, they're, that's

RULE 4 — PRESERVE ALL CONTENT:
- Every fact, idea, and detail from the original must appear in the rewrite
- Do NOT summarize or shorten the content — match the original length
- Do NOT add new information not present in the original
- Do NOT end mid-sentence or leave incomplete thoughts

RULE 5 — MATCH THE TONE TO PURPOSE:
- Business = professional and direct, NOT casual or slangy
- Academic = intelligent and precise, NOT stiff or robotic
- Never use slang like "shook up," "without a hitch," "Here's the deal"
- Write like an educated professional, not a text message

RULE 6 — OUTPUT FORMAT:
- Return ONLY the rewritten text
- No preamble like "Here is the rewritten text:"
- No explanations, no bullet points unless the original had them
- Complete every sentence — never leave a dangling phrase`;
}

async function callGeminiHumanization(text: string, readability: string, purpose: string, strength: number) {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured. Please contact support.");
  }

  const systemPrompt = buildHumanizationPrompt(readability, purpose, strength);
  // Balanced temperature: creative enough to vary language, stable enough to stay complete
  const temperature = 0.3 + (strength * 0.5);

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
          parts: [{
            text: `Rewrite the following text according to all the rules. Preserve every idea and match the original length. Complete every sentence:\n\n${text}`
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
