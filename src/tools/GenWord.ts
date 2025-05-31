"use server";
import Together from 'together-ai';
import {GoogleGenImage} from "@/tools/GoogleGenImage";

type GenWordsResult = {
    imageUrl: string;
    englishWord: string;
};

export async function getEnglishWord(input: string): Promise<string> {
    const together = new Together();

    const completion = await together.chat.completions.create({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
            {
                role: 'user',
                content: `Translate the following Vietnamese words into English: "${input}".
                 Return only the English word. 
                 Try to return the word you think is most suitable.`,
            },
        ],
    });

    // @ts-expect-error fix it later
    return completion.choices[0].message.content.trim();
}

export async function generateImage(word: string): Promise<string> {
    const together = new Together();

    const image = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: `A crayon pencil drawing by a child, cute, colorful, innocent, and simple, of a ${word}`,
        response_format: "base64",
        height: 512,
        width: 512,
        n: 1,
        steps: 4,
        output_format: "png"
    });
    console.log('image.data size', image.data[0].b64_json?.length);

    return 'data:image/png;base64,' + image.data[0].b64_json;
}

export async function GenWords(input: string): Promise<GenWordsResult> {
    const englishWord = await getEnglishWord(input);
    console.log("Get word", englishWord);

    const imageUrl = await GoogleGenImage(englishWord);
    console.log("Get image", imageUrl.length);

    return {imageUrl, englishWord};
}