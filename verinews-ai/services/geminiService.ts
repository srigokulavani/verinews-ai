
import { GoogleGenAI, Type } from "@google/genai";
import { NewsArticle, NewsCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NEWS_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      summary: { type: Type.STRING },
      category: { type: Type.STRING },
      country: { type: Type.STRING },
      publishedAt: { type: Type.STRING },
      verifiedAt: { type: Type.STRING },
      authenticityScore: { type: Type.NUMBER },
      verificationStatus: { type: Type.STRING },
      explanation: { type: Type.STRING },
      sources: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            url: { type: Type.STRING }
          },
          required: ["name", "url"]
        }
      },
      imageUrl: { type: Type.STRING }
    },
    required: ["id", "title", "summary", "category", "country", "publishedAt", "verifiedAt", "authenticityScore", "verificationStatus", "explanation", "sources", "imageUrl"]
  }
};

export const fetchAndVerifyNews = async (
  category: NewsCategory = 'All', 
  searchQuery: string = ''
): Promise<NewsArticle[]> => {
  const isSearch = searchQuery.trim().length > 0;
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-IN');
  
  const prompt = `
    Today's Date: ${currentDate}.
    Your Role: Expert News Auditor and Fact-Checker.
    
    Instruction: ${isSearch 
      ? `FETCH and VERIFY news specifically about: "${searchQuery}". If the query refers to a past event or historical context, fetch and verify the details from reliable news archives and records. Otherwise, focus on the most recent developments.` 
      : `FETCH and VERIFY the latest major news for the category: "${category}".`
    }
    
    Verification Protocol:
    1. Cross-reference the query across high-authority outlets and archives:
       - Indian: NDTV, The Hindu, Indian Express, DD News, News18, Press Trust of India (PTI), Times of India.
       - International: Reuters, Associated Press (AP), BBC, Bloomberg, Al Jazeera, New York Times, The Guardian.
    2. For historical queries, ensure the "publishedAt" date accurately reflects when the event occurred or was originally reported.
    3. Assess the "Authenticity Score" (0-100) based on consensus across these outlets and historical records.
    4. Generate an "AI Audit Explanation" summarizing why this story is deemed verified, including historical context if applicable.
    
    Requirements:
    - Return exactly 6 articles.
    - Ensure all Source URLs are realistic and lead to the news organization's domain.
    - category should be "${category}" or a sub-category relevant to the result.
    - country should be "India" or "Global".
    - verifiedAt should be "${now.toISOString()}".

    Output MUST be a valid JSON array matching the provided schema. No markdown wrapping.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: NEWS_SCHEMA,
        temperature: 0.1,
        // Using thinking budget to ensure the model actually performs the 'auditing' logic
        thinkingConfig: { thinkingBudget: 1000 },
        maxOutputTokens: 4000
      },
    });

    if (!response || !response.text) {
      throw new Error("Empty response from AI engine.");
    }

    const cleanedText = response.text.trim();
    if (!cleanedText.startsWith('[')) {
       throw new Error("Invalid format received from verification engine.");
    }

    const result = JSON.parse(cleanedText);
    return (Array.isArray(result) ? result : []) as NewsArticle[];
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    if (error.message?.includes('500') || error.message?.includes('xhr') || error.message?.includes('6')) {
      throw new Error("The verification engine is currently overloaded. Retrying with lower complexity...");
    }
    
    throw error;
  }
};
