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
    case "High School": return "Write at a high school reading level with simpler vocabulary and shorter sentences. ";
    case "University": return "Write at a university reading level with academic but accessible language. ";
    case "Doctorate": return "Write at an advanced academic level with sophisticated vocabulary and complex sentence structures. ";
    case "Journalist": return "Write in a journalistic style with clear, engaging language that balances formality and accessibility. ";
    case "Marketing": return "Write in a persuasive, engaging style that would be effective for marketing content. ";
    default: return "Write at a university reading level with academic but accessible language. ";
  }
}

function buildPurposePrompt(purpose: string): string {
  switch (purpose) {
    case "Academic": return "Format text for academic purposes, maintaining a formal tone with proper citations and logical structure. ";
    case "Business": return "Format text for business contexts, with clear points, professional tone, and actionable insights. ";
    case "Creative": return "Rewrite with a creative flair, using vivid language, varied sentence structures, and engaging style. ";
    case "Technical": return "Optimize for technical writing, with precise terminology, clear explanations, and logical organization. ";
    default: return "Create natural-sounding general content that reads as if written by a human. ";
  }
}

function buildStrengthPrompt(strength: number): string {
  if (strength < 0.3) {
    return "Make minimal changes, focusing only on the most obvious machine patterns. Preserve most of the original text.";
  } else if (strength < 0.6) {
    return "Make moderate changes to sentence structure and word choice, while preserving the original meaning and key phrases.";
  } else {
    return "Significantly rewrite the text with substantial changes to sentence structure, word choice, and organization. Make it sound completely human-written.";
  }
}

function buildHumanizationPrompt(readability: string, purpose: string, strength: number): string {
  let prompt = "You are an expert at rewriting AI-generated content to sound natural and human-written. ";
  prompt += buildReadabilityPrompt(readability);
  prompt += buildPurposePrompt(purpose);
  prompt += buildStrengthPrompt(strength);
  prompt += `

Follow these specific requirements:
1. Maintain the original meaning completely
2. Fix awkward phrasing and robotic patterns
3. Vary sentence structure and length naturally
4. Use natural transitions between ideas
5. Introduce human-like language patterns (idioms, contractions, etc.)
6. Never add "[" or "]" characters to your response
7. Return only the humanized text, nothing else`;
  return prompt;
}

async function callGeminiHumanization(text: string, readability: string, purpose: string, strength: number) {
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured. Please contact support.");
  }

  const systemPrompt = buildHumanizationPrompt(readability, purpose, strength);
  const temperature = 0.2 + (strength * 0.8);

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
          parts: [{ text: `Please humanize the following text:\n\n${text}` }]
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
