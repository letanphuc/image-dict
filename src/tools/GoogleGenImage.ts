"use server";
import {GoogleGenAI, Modality} from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

export async function GoogleGenImage(prompt: string): Promise<string> {
    const p = `A detailed crayon pencil drawing of a ${prompt}, rendered with child-like innocence, cute and vibrant colors, set against a vintage yellowed grid paper.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: p,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });

    try {
        // @ts-expect-error fix it later
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const {mimeType, data} = part.inlineData;
                return `data:${mimeType};base64,${data}`;
            }
        }
    } catch (e) {
        console.error(e);
    }
    throw new Error("No image data found in response.");
}


export async function GoogleEnglishWord(input: string): Promise<string> {
    const p = `Translate the following Vietnamese words into English: "${input}".
     Return only the English word. Try to return the word you think is most suitable.`
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: p
    });

    try {
        return response.text || "";
    } catch (e) {
        console.error(e);
    }
    throw new Error("No English word found in response.");
}