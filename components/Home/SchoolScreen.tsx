'use client'

import Image from 'next/image'
import React, { useState } from 'react'

function buildDefaultQuestions(topic: string) {
  const safeTopic = topic.trim() || 'today'
  return [
    `In one short sentence, explain what ${safeTopic} is to your neko.`,
    `Write one cute example or fun fact about ${safeTopic}.`,
    `Why do you think ${safeTopic} matters in real life?`,
  ]
}

export function SchoolScreen() {
  const [topic, setTopic] = useState<string>('')
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const [hasReviewed, setHasReviewed] = useState(false)

  const filledCount = answers.filter((a) => a.trim().length > 5).length
  const score = (filledCount / 3) * 100

  let nekoMood = 'ahh… i couldn’t really get it yet.'
  let understandingLabel = 'still sleepy about this topic'
  let understandingColor = '#EF5350'

  if (score >= 34 && score < 80) {
    nekoMood = 'hmm… it&apos;s starting to make sense!'
    understandingLabel = 'neko is kinda getting it'
    understandingColor = '#FFCA28'
  } else if (score >= 80) {
    nekoMood = 'ahhh, that makes sense now! ⭐'
    understandingLabel = 'neko feels smart about this'
    understandingColor = '#A5D6A7'
  }

  function handleStartLesson() {
    setQuestions(buildDefaultQuestions(topic))
    setAnswers(['', '', ''])
    setHasReviewed(false)
  }

  function handleAnswerChange(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleReview() {
    setHasReviewed(true)
    // later: send topic + questions + answers to OpenRouter + Supabase
  }

  return (
    <div className="baseneko-graph-paper flex w-full flex-1 items-stretch justify-center px-3 pb-4 pt-3 overflow-y-auto">
      <div className="flex w-full max-w-sm flex-1 flex-col gap-4">
        <header className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border-4 border-[#5D4037] bg-[#FFE4B5]">
            <Image
              src="/XmasCatFree/Jump.png"
              alt="Studious neko"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xs text-[#5D4037]">school</h1>
            <p className="text-[9px] text-[#8D6E63]">
              teach your neko any topic. answer 3 tiny questions, then let the cozy AI teacher react.
            </p>
          </div>
        </header>

        <section className="baseneko-card flex w-full flex-col gap-3 rounded-2xl p-4">
          <label className="flex flex-col gap-1 text-[9px] text-[#5D4037]">
            lesson topic
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. volcanoes, space, fractions"
              className="baseneko-pill w-full bg-[#FFF8E1] px-3 py-2 text-[9px] outline-none placeholder:text-[#BCAAA4]"
            />
          </label>

          <button
            type="button"
            onClick={handleStartLesson}
            className="mt-2 w-full rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none"
          >
            start cozy lesson ✏️
          </button>

          {questions.length > 0 && (
            <div className="mt-3 space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q}
                  className="rounded-xl border-2 border-[#BCAAA4] bg-[#FFFDE7] p-3 text-[8px] text-[#6D4C41]"
                >
                  <p className="mb-2 text-[9px] text-[#5D4037]">
                    Q{idx + 1}. {q}
                  </p>
                  <textarea
                    value={answers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    rows={2}
                    className="baseneko-pill w-full bg-[#FFF8E1] px-2 py-2 text-[9px] text-[#3E2723] outline-none"
                    placeholder="type your answer here…"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={handleReview}
                className="mt-1 w-full rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none"
              >
                ask neko teacher to review 🧠
              </button>
            </div>
          )}
        </section>

        {questions.length > 0 && (
          <section className="baseneko-card flex flex-col gap-3 rounded-2xl p-4 text-[9px] text-[#5D4037]">
            <p className="text-[9px] font-normal text-[#5D4037]">topic status</p>
            <div className="flex flex-col gap-1 text-[8px] text-[#6D4C41]">
              <p>
                topic:{' '}
                <span className="baseneko-pill inline-block bg-[#FFF8E1] px-2 py-1 text-[8px] text-[#3E2723]">
                  {topic.trim() || 'mystery topic'}
                </span>
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span>understanding</span>
                <div className="relative h-3 flex-1 baseneko-pill overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{ width: `${Math.max(5, score)}%`, backgroundColor: understandingColor }}
                  />
                </div>
              </div>
              {hasReviewed ? (
                <p className="mt-1">
                  neko says: <span dangerouslySetInnerHTML={{ __html: nekoMood }} />
                </p>
              ) : (
                <p className="mt-1">
                  neko is waiting for your answers. fill all 3 and tap{' '}
                  <span className="font-semibold">ask neko teacher to review</span>.
                </p>
              )}
              <p className="mt-1 text-[8px] text-[#8D6E63]">{understandingLabel}</p>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-1 text-[8px] text-[#8D6E63]">
          <p>
            later, this screen will save lesson results to Supabase and use real AI grading so your
            neko can earn intelligence XP and badges.
          </p>
        </section>
      </div>
    </div>
  )
}

export default SchoolScreen
