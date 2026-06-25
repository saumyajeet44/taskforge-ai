import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, description, deadline } = await req.json();

    const prompt = `
You are an AI productivity assistant.

Task: ${title}
Description: ${description}
Deadline: ${deadline}

Analyze the task and return ONLY valid JSON:

{
  "priority": "HIGH | MEDIUM | LOW",
  "reason": "short reason",
  "breakdown": [
    "step 1",
    "step 2",
    "step 3"
  ]
}
`;
    console.log("USING MODEL NOW");
    const result = await model.generateContent(prompt);
const text = result.response.text();

console.log("RAW GEMINI RESPONSE:");
console.log(text);

const cleaned = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const aiData = JSON.parse(cleaned);

    const task = await prisma.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        priority: aiData.priority,
        aiReasoning: aiData.reason,
        aiBreakdown: JSON.stringify(aiData.breakdown),
      },
    });

    return NextResponse.json(task);
  } catch (error: any) {
  console.error("REAL ERROR:", error);

  return NextResponse.json(
    {
      error: error?.message || "Failed to create task",
    },
    { status: 500 }
  );
}
}

export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(tasks);
}