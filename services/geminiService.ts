
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `اكتب وصفاً تسويقياً جذاباً ومختصراً باللغة العربية لمنتج ملابس رجالي اسمه "${productName}" وينتمي لفئة "${category}". اجعله يبدو فاخراً ومناسباً لمتجر اسم "GAMAL".`,
    });
    return response.text || "وصف رائع لمنتج مميز من تشكيلة جمال الفاخرة.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "تشكيلة حصرية من متجر جمال للرجل العصري.";
  }
};

export const generateProductImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K"): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `High-end professional studio photography of men's fashion: ${prompt}. Minimalist background, cinematic lighting, 8k resolution, luxury aesthetic.` }] },
      config: { imageConfig: { aspectRatio: "3:4", imageSize: size } },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

export const editProductImage = async (base64Image: string, editPrompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const [mime, data] = base64Image.split(',');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: data || base64Image, mimeType: 'image/png' } },
          { text: `Edit this men's fashion photo: ${editPrompt}. Maintain the item details but apply the requested changes.` }
        ]
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image editing error:", error);
    return null;
  }
};

export const animateProduct = async (base64Image: string, orientation: '16:9' | '9:16' = '9:16'): Promise<string | null> => {
  try {
    const ai = getAI();
    const [mime, data] = base64Image.split(',');
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: 'A cinematic slow-motion fashion showcase of this item. Smooth camera movement, elegant atmosphere.',
      image: { imageBytes: data || base64Image, mimeType: 'image/png' },
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: orientation }
    });
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (error) {
    console.error("Video generation error:", error);
    return null;
  }
};

export const getSmartResponse = async (query: string, history: any[] = []): Promise<{ text: string; sources?: any[] }> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [...history, { role: 'user', parts: [{ text: query }] }],
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        systemInstruction: "You are the GAMAL Fashion AI Assistant. Help users with styling, product info, and finding stores. Use search for current trends and maps for locations. Respond in Arabic with a helpful and luxury tone."
      },
    });
    return {
      text: response.text || "",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Smart response error:", error);
    return { text: "عذراً، أواجه مشكلة في معالجة طلبك حالياً." };
  }
};

export const textToSpeech = async (text: string): Promise<Uint8Array | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say warmly in Arabic: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes;
    }
    return null;
  } catch (error) {
    console.error("TTS error:", error);
    return null;
  }
};
