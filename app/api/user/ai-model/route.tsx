import Constants from "@/app/data/Constants";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { model, description, imageUrl } = await req.json();
        console.log(model, description, imageUrl);

        if (!description || !imageUrl) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        const modelObj = Constants.AiModelList.find(item => item.name === model);
        const modelName = modelObj?.modelName ?? 'google/gemini-2.0-pro-exp-02-05:free';

        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: description
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }
            ],
            stream: true // Enable streaming
            
        });

        // Create a readable stream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices?.[0]?.delta?.content || "";
                        if (text) {
                            controller.enqueue(new TextEncoder().encode(text));
                        }
                    }
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });

    } catch (error) {
        console.error("API Error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500 }
        );
    }
}