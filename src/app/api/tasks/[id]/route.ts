import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const task = await prisma.task.update({
    where: { id },
    data: {
      isCompleted: true,
    },
  });

  return NextResponse.json(task);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.task.delete({
    where: { id },
  });

  return NextResponse.json({
    success: true,
  });
}