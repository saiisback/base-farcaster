import { NextRequest } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const CreateLessonSchema = z.object({
  address: z.string().min(1),
  topic: z.string().min(1).max(200),
  mode: z.enum(['concept', 'exam', 'intuition']),
  questions: z.array(z.string()).min(1).max(10),
  answers: z.array(z.string()).min(1).max(10),
  score: z.number().int().min(0).max(100),
  review: z.string().optional(),
  cheatSheet: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = CreateLessonSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { address, topic, mode, questions, answers, score, review, cheatSheet } = parsed.data

  const created = await prisma.nekoLesson.create({
    data: {
      address: address.toLowerCase(),
      topic,
      mode,
      questions,
      answers,
      score,
      review,
      cheatSheet,
    },
  })

  return Response.json({ ok: true, lesson: created })
}
