
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptEntry } from "../types";

export const analyzeFinanceData = async (entries: ReceiptEntry[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summaryString = entries.map(e => 
    `Date: ${e.date}, Item: ${e.itemDescription}, Total: ₹${e.totalAmount}, Status: ${e.status}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following receipt ledger and provide a short executive summary of business health, focusing on revenue vs pending/cancelled amounts:\n\n${summaryString}`,
      config: {
        systemInstruction: "You are a senior financial analyst. Be concise, professional, and focus on actionable insights.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to generate AI analysis at this time.";
  }
};
