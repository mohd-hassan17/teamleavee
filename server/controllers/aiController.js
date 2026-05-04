import { GoogleGenAI } from "@google/genai";

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is required");
    error.statusCode = 503;
    throw error;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });
    const text = response.text;

    if (!text) {
      const error = new Error("Gemini returned an empty response");
      error.statusCode = 502;
      throw error;
    }

    return text;
  } catch (error) {
    error.statusCode = error.statusCode || 502;
    error.message = error.message || "Gemini request failed";
    throw error;
  }
};

const parseJsonText = (text) => {
  const cleaned = String(text)
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    const error = new Error("AI response was not valid JSON");
    error.statusCode = 502;
    throw error;
  }

  try {
    return JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));
  } catch (error) {
    const parseError = new Error("AI response was not valid JSON");
    parseError.statusCode = 502;
    throw parseError;
  }
};

const requireStringFields = (data, fields) => {
  const missing = fields.filter((field) => typeof data[field] !== "string" || !data[field].trim());

  if (missing.length > 0) {
    const error = new Error(`AI response missing fields: ${missing.join(", ")}`);
    error.statusCode = 502;
    throw error;
  }

  return data;
};

export const parseLeave = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const output = await callGemini(
    `Extract leave details from the request. Think internally, but do not include reasoning. Return only this JSON shape:
{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "type": "leave type",
  "reason": "short reason"
}

Request: ${text}`
  );

  res.json(requireStringFields(parseJsonText(output), ["startDate", "endDate", "type", "reason"]));
});

export const managerInsight = asyncHandler(async (req, res) => {
  const { leaveRequest, teamData } = req.body;

  if (!leaveRequest || !teamData) {
    return res.status(400).json({ message: "leaveRequest and teamData are required" });
  }

  const output = await callGemini(
    `Review this leave request for a manager. Think internally about staffing, timing, overlap, and context. Do not include reasoning. Return only this JSON shape:
{
  "summary": "brief summary",
  "recommendation": "approve, reject, or review with a short reason"
}

Leave request: ${JSON.stringify(
      leaveRequest
    )}\n\nTeam data: ${JSON.stringify(teamData)}`
  );

  res.json(requireStringFields(parseJsonText(output), ["summary", "recommendation"]));
});
