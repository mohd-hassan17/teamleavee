const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is required");
    error.statusCode = 503;
    throw error;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error?.message || "Gemini request failed");
    error.statusCode = response.status;
    throw error;
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const parseJsonText = (text) => {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
};

export const parseLeave = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  const output = await callGemini(
    `Extract leave details from this request and return only JSON with startDate, endDate, type, and reason. Use YYYY-MM-DD dates.\n\nRequest: ${text}`
  );

  res.json(parseJsonText(output));
});

export const managerInsight = asyncHandler(async (req, res) => {
  const { leaveRequest, teamData } = req.body;

  if (!leaveRequest || !teamData) {
    return res.status(400).json({ message: "leaveRequest and teamData are required" });
  }

  const output = await callGemini(
    `You are helping a manager review leave. Return only JSON with summary and recommendation.\n\nLeave request: ${JSON.stringify(
      leaveRequest
    )}\n\nTeam data: ${JSON.stringify(teamData)}`
  );

  res.json(parseJsonText(output));
});
