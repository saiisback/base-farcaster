import { NextRequest } from 'next/server'
import { z } from 'zod'

const RequestSchema = z.object({
  topic: z.string().max(200).optional(),
  questions: z.array(z.string()).min(1).max(10),
  answers: z.array(z.string()).min(1).max(10),
})

const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY || process.env.openrouter_api_key

if (!OPENROUTER_API_KEY) {
  // Fail fast at build/start if the key is missing so it's obvious in logs
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

  const { topic, questions, answers } = parsed.data

  const paired = questions.map((q, idx) => {
    const a = answers[idx] ?? ''
    return `Q${idx + 1}: ${q}\nA${idx + 1}: ${a}`
  })

  const prompt = [
    'You are a cozy, kind teacher for a digital pet cat called "neko".',
    'You are helping the human teach their neko a topic using 3 very short answers.',
    '',
    topic ? `Topic: ${topic}` : 'Topic: (unspecified)',
    '',
    'Here are the questions and answers:',
    paired.join('\n\n'),
    '',
    'In 3–5 short sentences:',
    '- Gently say how well the neko seems to understand the topic (no scores).',
    '- Highlight one thing they did well.',
    '- Suggest one simple improvement or follow-up question.',
    '',
    'Keep the tone soft and encouraging, and write as if you are talking directly to the neko.',
  ].join('\n')

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a cozy, kind teacher for a digital pet cat called "neko". Always keep responses very short and reassuring.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 350,
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

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }

    const content =
      data.choices?.[0]?.message?.content?.trim() ??
      'The neko teacher is a bit sleepy and could not review this right now.'

    return Response.json({
      ok: true,
      review: content,
    })
  } catch (error) {
    console.error('Error calling OpenRouter', error)
    return Response.json(
      {
        ok: false,
        error: 'Failed to contact neko teacher. Please try again in a moment.',
      },
      { status: 500 },
    )
  }
}

