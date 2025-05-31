"use server";
import {GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

export async function GoogleGenImage(prompt: string): Promise<string> {
    const p = `A detailed crayon pencil drawing of a ${prompt}, rendered with child-like innocence, cute and vibrant colors, set against a vintage yellowed grid paper.`;
    const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: p,
        config: {
            numberOfImages: 1,
            aspectRatio: "1:1",
        },
    });

    try {
        // @ts-expect-error fix it later
        const generatedImage = response.generatedImages[0];
        // @ts-expect-error fix it later
        const imgBytes = generatedImage.image.imageBytes;
        return `data:image/png;base64,${imgBytes}`

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