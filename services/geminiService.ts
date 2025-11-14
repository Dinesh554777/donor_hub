
import { GoogleGenAI, Type } from "@google/genai";
import { Donor, AIFatigueResponse } from '../types';

// This should be in a secure environment variable, but for this example, we assume it's available.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this project, we'll allow it to fail if no key is present.
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeDonorFatigue = async (donor: Donor): Promise<AIFatigueResponse> => {
  if (!API_KEY) {
    // Simulate a delay and return a mock response if API key is not set
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResponses: AIFatigueResponse[] = [
      { fatigueRisk: 'Low', outreachSuggestion: 'Thank them for their recent donation and mention the next drive.' },
      { fatigueRisk: 'Medium', outreachSuggestion: 'Suggest a slightly longer break before the next donation.' },
      { fatigueRisk: 'High', outreachSuggestion: 'Recommend a wellness check-in and a significant rest period.' },
    ];
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  // FIX: Safely access optional `donationHistory` property using optional chaining and nullish coalescing to prevent runtime errors.
  const donorInfo = {
    age: donor.age,
    totalDonations: donor.totalDonations,
    lastDonationDate: donor.donationHistory?.[0]?.date,
    donationsInLast12Months: (donor.donationHistory ?? []).filter(d => new Date(d.date) > new Date(new Date().setFullYear(new Date().getFullYear() - 1))).length,
  };

  const prompt = `
    Analyze the following blood donor's data to determine their potential fatigue risk from donating too frequently. 
    Provide a risk level (Low, Medium, or High) and a concise, friendly outreach suggestion for the admin.
    
    Donor Data:
    - Age: ${donorInfo.age}
    - Total Donations: ${donorInfo.totalDonations}
    - Last Donation Date: ${donorInfo.lastDonationDate || 'N/A'}
    - Donations in last 12 months: ${donorInfo.donationsInLast12Months}
    
    Respond ONLY with a JSON object in the specified format.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fatigueRisk: {
              type: Type.STRING,
              description: "The calculated fatigue risk level for the donor. Can be 'Low', 'Medium', or 'High'.",
            },
            outreachSuggestion: {
              type: Type.STRING,
              description: "A short, friendly, and actionable message for an admin to send to the donor.",
            },
          },
          required: ["fatigueRisk", "outreachSuggestion"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as AIFatigueResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from AI.");
  }
};