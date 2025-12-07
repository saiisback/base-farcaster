import { NextRequest } from 'next/server'
import { z } from 'zod'

const RequestSchema = z.object({
  topic: z.string().min(1).max(200),
  mode: z.enum(['concept', 'exam', 'intuition']).default('concept'),
})

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || process.env.openrouter_api_key

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY (or openrouter_api_key) is not defined')
}

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = RequestSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { topic, mode } = parsed.data

  const modeHint =
    mode === 'exam'
      ? 'Focus on exam-style prompts: precise, short, and check for common pitfalls.'
      : mode === 'intuition'
        ? 'Focus on intuition and analogies; avoid heavy notation.'
        : 'Focus on core definition, one example, and why it matters for builders or engineers.'

  const prompt = [
    'You are helping a human teach a digital cat ("neko") about a topic.',
    'The human is a teen or engineering student explaining what they are learning.',
    '',
    `Topic: ${topic}`,
    '',
    modeHint,
    '',
    'Generate exactly 3 short, concrete questions that the human should answer in order.',
    'Each question should be self-contained and refer to the topic explicitly when helpful.',
    'Return ONLY valid JSON in the following format and nothing else:',
    '{"questions": ["question 1", "question 2", "question 3"]}',
  ].join('\n')

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content:
              'You create very focused, topic-specific study questions for a bright teen / engineering student teaching a digital cat ("neko").',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      return Response.json(
        {
          ok: false,
          error: `OpenRouter request failed with status ${response.status}`,
          details: text.slice(0, 500),
        },
        { status: 502 },
      )
    }

    const raw = await response.text()

    let parsedJson: { questions?: string[] } | null = null
    try {
      parsedJson = JSON.parse(raw)
    } catch {
      // try to salvage JSON if there is extra text around it
      const firstBrace = raw.indexOf('{')
      const lastBrace = raw.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        try {
          parsedJson = JSON.parse(raw.slice(firstBrace, lastBrace + 1))
        } catch {
          parsedJson = null
        }
      }
    }

    const questions =
      parsedJson?.questions?.filter((q) => typeof q === 'string' && q.trim().length > 0) ?? []

    if (questions.length === 0) {
      return Response.json(
        {
          ok: false,
          error: 'Model did not return valid questions JSON.',
        },
        { status: 500 },
      )
    }

    return Response.json({
      ok: true,
      questions: questions.slice(0, 3),
    })
  } catch (error) {
    console.error('Error calling OpenRouter (neko-questions)', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to generate questions. Please try again.',
      },
      { status: 500 },
    )
  }
}
