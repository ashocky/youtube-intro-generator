import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const topic: string | null = searchParams.get("prompt");

  if (!topic) {
    return NextResponse.json(
      { error: "Missing or invalid 'prompt' query parameter." },
      { status: 400 }
    );
  }

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller: ReadableStreamDefaultController<Uint8Array>) {
      const hfApiToken: string = process.env
        .HUGGING_FACE_ACCESS_TOKEN as string;

      if (!hfApiToken) {
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              error: "Missing Hugging Face API token",
            })}\n\n`
          )
        );
        controller.close();
        return;
      }

      const craftedPrompt: string = `You are a professional YouTube scriptwriter, known for your dark humor, suspenseful storytelling, and engaging narratives.

### **Your task:** 
Write a **compelling YouTube video introduction** for the topic: **"${topic}"**.

### **STRICT RULES (MUST FOLLOW)**
**The first sentence MUST be a powerful hook.**  
**Do NOT turn this into a discussion. This must be a structured, cinematic-style intro.**  
**Write as if this is the opening monologue of a viral YouTube video.**  
**Do NOT break the intro flow with direct questions to the audience.**  
**Ensure it’s a continuous, well-structured introduction between 200-300 words.**  
**It MUST feel dramatic, thought-provoking, and suspenseful.**  

---
### **FORMAT EXAMPLE (FOLLOW THIS STYLE EXACTLY)**
Most people assume drive-thru safari parks are safe. After all, you stay in your car, watch the animals, and snap a few selfies. But here’s the thing—if you break just *one* rule, you might not make it out alive. That’s exactly what happened on a summer afternoon when an unsuspecting visitor thought it would be a great idea to step outside. The moment their foot hit the ground, a tiger was already watching... (continue in a similar storytelling format)

---
### **NOW WRITE A COMPLETE YOUTUBE INTRO IN THIS EXACT FORMAT FOR THE TOPIC:** "${topic}".`;

      try {
        const hf = new HfInference(hfApiToken);
        let fullText: string = "";

        for await (const output of hf.textGenerationStream({
          model: process.env.HUGGING_MODEL,
          inputs: craftedPrompt,
          parameters: { max_new_tokens: 800, temperature: 0.7, top_p: 0.9 },
        })) {
          if (output.token?.text) {
            const encodedText = new TextEncoder().encode(
              `data: ${output.token.text}\n\n`
            );
            controller.enqueue(encodedText);

            fullText += output.token.text;
          }
        }


        controller.enqueue(new TextEncoder().encode(`data: ${fullText}\n\n`));
        controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);
        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ error: "Error generating script" })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
