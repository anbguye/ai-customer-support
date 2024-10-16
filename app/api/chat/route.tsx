import { NextResponse } from 'next/server' // imports nextresponse from next.js to handle responses 
import OpenAI from 'openai' //imports openai library for interacting with openai API

//system prompt for ai, providing guidelines on how to respond to users
const systemPrompt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.'

export async function POST(req: Request) {
    const openai = new OpenAI() //creates a new instance of the openai class
    const data = await req.json()

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...data], //sends the system prompt and the user's message to the openai API
      model: "gpt-4o-mini", //specifies the model to use for the conversation
      stream: true, //enables streaming
    });

    // returns the completion from the openai API
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder() // encodes the text
            try {
                // loops through the completion and sends the content to the client
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content // gets the content from the completion
                    if (content) {
                        const text = encoder.encode(content) // sends the content to the client
                        controller.enqueue(text) // sends the content to the client
                    }
                }
            } 
            catch (err) {
                controller.error(err) // sends an error to the client
            } finally {
                controller.close() // closes the controller
            }
        }
    })
    return new  NextResponse(stream) // returns the stream to the client
}