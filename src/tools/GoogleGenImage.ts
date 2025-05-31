"use server";
import {GoogleGenAI} from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

export async function GoogleGenImage(prompt: string): Promise<string> {
    const p = `A crayon drawing of a ${prompt} by a 4-year-old child on yellow grid paper, with scribbly lines and bright colors. 
    The drawing shows the joy and rich imagination of a child, clearly expressed through bold, rough strokes and vibrant use of color.
    The yellow grid paper adds a playful contrast to the crayon’s bright tones.`;
    const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: p,
        config: {
            numberOfImages: 1,
            aspectRatio: "1:1",
            outputMimeType: "image/jpeg",
            outputCompressionQuality: 70
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