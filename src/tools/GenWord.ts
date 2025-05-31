"use server";
import Together from 'together-ai';

type GenWordsResult = {
    imageUrl: string;
    englishWord: string;
};

export async function GenWords(input: string): Promise<GenWordsResult> {
    const together = new Together();

    const completion = await together.chat.completions.create({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
        messages: [
            {
                role: 'user',
                content: `Translate the following Vietnamese words into English: "${input}".
                 Return only the English word. 
                 If the word is a phrase, return the first word of the phrase. 
                 If the word is "Pig's blood", return "Pig".`,
            },
        ],
    });

    // @ts-expect-error fix it later
    const englishWord = completion.choices[0].message.content.trim();
    console.log("Get word", englishWord)

    const image = await together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: `a crayon pencil drawing by a child, cute, colorful, innocent, and simple, of a ${englishWord}`,
        response_format: "url",
        height: 512,
        width: 512
    });

    const imageUrl = image.data[0].url || '';
    console.log("Get image", imageUrl.length)

    return {
        imageUrl,
        englishWord,
    };
}