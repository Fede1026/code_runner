import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// We keep the runtime standard node here because of standard execution capabilities and deps.
export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables. Please add it to your .env.local file to use the Python execution engine." }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-1.5-pro or 2.5-pro which supports codeExecution
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      tools: [
        {
          codeExecution: {},
        },
      ],
    });

    const prompt = `Execute the following Python code using your codeExecution tool. Start your response strictly with the plain text stdout/stderr from the code execution, and nothing else (no conversational filler, no markdown blocks, no 'Here is the output'). You must use the tool.

Code to execute:
\`\`\`python
${code}
\`\`\`
`;
    // We let Gemini run the code and we extract the text response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Attempt to extract the executable output piece from the model's response if necessary
    // If the model responded directly, it might be the pure string output
    const text = response.text();

    return NextResponse.json({ output: text });
  } catch (error: any) {
    console.error("Code execution API error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute python due to an internal API error." }, { status: 500 });
  }
}
