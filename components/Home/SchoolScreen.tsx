'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { BASENEKO_BADGES_ABI, BASENEKO_BADGES_ADDRESS } from '@/lib/abis'

type StudyMode = 'concept' | 'exam' | 'intuition'

function buildDefaultQuestions(topic: string, mode: StudyMode) {
  const safeTopic = topic.trim() || 'this topic'

  if (mode === 'exam') {
    return [
      `Explain ${safeTopic} to your neko as if you are writing a short exam definition.`,
      `Give one concrete example or simple calculation that uses ${safeTopic}.`,
      `What is one common mistake people make with ${safeTopic}, and how would you warn your neko about it?`,
    ]
  }

  if (mode === 'intuition') {
    return [
      `Describe the core intuition of ${safeTopic} to your neko using an everyday analogy (no formulas first).`,
      `Tell a tiny story where ${safeTopic} quietly shows up in real life.`,
      `If your neko forgets ${safeTopic} tomorrow, what is the ONE idea they must remember?`,
    ]
  }

  return [
    `In one short sentence, explain what ${safeTopic} is to your neko as if they are a curious first-year student.`,
    `Write one clean example or fun fact about ${safeTopic} that would make sense to your neko.`,
    `Why does ${safeTopic} actually matter for engineers or builders in the real world?`,
  ]
}

export function SchoolScreen() {
  const { address } = useAccount()
  const [topic, setTopic] = useState<string>('')
  const [questions, setQuestions] = useState<string[]>([])
  const [answers, setAnswers] = useState<string[]>(['', '', ''])
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewText, setReviewText] = useState<string | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [mode, setMode] = useState<StudyMode>('concept')
  const [cheatSheet, setCheatSheet] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { writeContract: writeBadges } = useWriteContract()

  const filledCount = answers.filter((a) => a.trim().length > 5).length
  const score = (filledCount / 3) * 100

  let nekoMood = "ahh… i couldn't really get it yet."
  let understandingLabel = 'still sleepy about this topic'
  let understandingColor = '#EF5350'

  if (score >= 34 && score < 80) {
    nekoMood = "hmm… it's starting to make sense!"
    understandingLabel = 'neko is kinda getting it'
    understandingColor = '#FFCA28'
  } else if (score >= 80) {
    nekoMood = 'ahhh, that makes sense now! ⭐'
    understandingLabel = 'neko feels smart about this'
    understandingColor = '#A5D6A7'
  }

  async function handleStartLesson() {
    const trimmedTopic = topic.trim()

    setAnswers(['', '', ''])
    setHasReviewed(false)
    setReviewText(null)
    setReviewError(null)
    setCheatSheet('')

    if (!trimmedTopic) {
      setQuestions(buildDefaultQuestions(trimmedTopic, mode))
      return
    }

    setIsGenerating(true)

    try {
      const res = await fetch('/api/neko-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmedTopic, mode }),
      })

      if (!res.ok) {
        setQuestions(buildDefaultQuestions(trimmedTopic, mode))
        return
      }

      const data = (await res.json()) as { ok?: boolean; questions?: string[] }
      if (!data.ok || !data.questions || data.questions.length === 0) {
        setQuestions(buildDefaultQuestions(trimmedTopic, mode))
      } else {
        setQuestions(data.questions.slice(0, 3))
      }
    } catch {
      setQuestions(buildDefaultQuestions(trimmedTopic, mode))
    } finally {
      setIsGenerating(false)
    }
  }

  function handleAnswerChange(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleReview() {
    if (answers.every((a) => a.trim().length === 0)) {
      setReviewError('fill in at least one answer before asking the neko teacher.')
      return
    }

    setIsReviewing(true)
    setHasReviewed(false)
    setReviewText(null)
    setReviewError(null)

    void (async () => {
      try {
        const res = await fetch('/api/neko-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: topic.trim() || undefined,
            questions,
            answers,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          const message =
            (data && (data.error as string)) ||
            'neko teacher could not review right now. please try again.'
          setReviewError(message)
        } else {
          const data = (await res.json()) as { ok?: boolean; review?: string; error?: string }
          if (!data.ok || !data.review) {
            setReviewError(
              data.error || 'neko teacher sent back a confusing answer. please try again in a bit.',
            )
          } else {
            setReviewText(data.review)
            setHasReviewed(true)

            try {
              const effectiveAddress = address ?? 'anonymous'
              await fetch('/api/neko-lessons', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  address: effectiveAddress,
                  topic: topic.trim() || 'untitled topic',
                  mode,
                  questions,
                  answers,
                  score: Math.round(score),
                  review: data.review,
                  cheatSheet,
                }),
              })
            } catch {
              // ignore persistence errors in the UI
            }

            try {
              if (address) {
                writeBadges({
                  address: BASENEKO_BADGES_ADDRESS,
                  abi: BASENEKO_BADGES_ABI,
                  functionName: 'mintBadgeForAchievement',
                  args: ['the tutor'],
                })
              }
            } catch {
              // ignore badge minting errors in the UI
            }
          }
        }
      } catch {
        setReviewError('something went wrong talking to the neko teacher.')
      } finally {
        setIsReviewing(false)
      }
    })()
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
              turn tough topics into neko-sized explanations. perfect for teens, uni, and engineering
              students teaching what they&apos;re learning.
            </p>
          </div>
        </header>

        <section className="baseneko-card flex w-full flex-col gap-3 rounded-2xl p-4">
          <div className="flex flex-col gap-1 text-[9px] text-[#5D4037]">
            <span className="mb-1">study mode</span>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: 'concept', label: 'concept check' },
                { id: 'exam', label: 'exam prep' },
                { id: 'intuition', label: 'intuition' },
              ] as { id: StudyMode; label: string }[]).map((item) => {
                const isActive = mode === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`baseneko-pill px-2 py-1 text-[8px] shadow-[0_2px_0_0_rgba(93,64,55,0.5)] active:translate-y-0.5 active:shadow-none ${
                      isActive ? 'bg-[#A5D6A7] text-[#3E2723]' : 'bg-[#FFF8E1] text-[#5D4037]'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-1 text-[8px] text-[#8D6E63]">
              pick how you want to train your neko: core concept, exam-style drilling, or pure
              intuition.
            </p>
          </div>

          <label className="flex flex-col gap-1 text-[9px] text-[#5D4037]">
            lesson topic
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. TCP congestion control, eigenvalues, NFTs, L1/L2 scaling"
              className="baseneko-pill w-full bg-[#FFF8E1] px-3 py-2 text-[9px] outline-none placeholder:text-[#BCAAA4]"
            />
          </label>

          <button
            type="button"
            onClick={handleStartLesson}
            disabled={isGenerating}
            className="mt-2 w-full rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:shadow-none"
          >
            {isGenerating ? 'crafting 3 neko questions…' : 'start cozy lesson ✏️'}
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
                disabled={isReviewing}
                className="mt-1 w-full rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:shadow-none"
              >
                {isReviewing ? 'neko teacher is thinking…' : 'ask neko teacher to review 🧠'}
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
              <p className="text-[8px] text-[#8D6E63]">
                pretend your neko is a bright first-year student; if they understand you, you probably
                understand the concept.
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
              {hasReviewed && (reviewText || nekoMood) && (
                <p className="mt-1 whitespace-pre-line">
                  neko says: <span>{reviewText || nekoMood}</span>
                </p>
              )}
              {!hasReviewed && !isReviewing && (
                <p className="mt-1">
                  neko is waiting for your answers. fill all 3 and tap{' '}
                  <span className="font-semibold">ask neko teacher to review</span>.
                </p>
              )}
              {isReviewing && (
                <p className="mt-1 text-[8px] text-[#8D6E63]">
                  neko teacher is thinking hard about your lesson…
                </p>
              )}
              {reviewError && (
                <p className="mt-1 text-[8px] text-[#D32F2F]">
                  {reviewError}
                </p>
              )}
              <p className="mt-1 text-[8px] text-[#8D6E63]">{understandingLabel}</p>
            </div>
          </section>
        )}

        {hasReviewed && (
          <section className="baseneko-card flex flex-col gap-2 rounded-2xl p-4 text-[8px] text-[#5D4037]">
            <p className="text-[9px] font-normal">your 3‑bullet cheat sheet</p>
            <p className="text-[8px] text-[#8D6E63]">
              write a tiny summary for your future self (and your neko). if it fits here, you&apos;ve
              probably internalised the core idea.
            </p>
            <textarea
              value={cheatSheet}
              onChange={(e) => setCheatSheet(e.target.value)}
              rows={3}
              className="baseneko-pill w-full bg-[#FFF8E1] px-2 py-2 text-[9px] text-[#3E2723] outline-none"
              placeholder="- key idea 1\n- key idea 2\n- key idea 3"
            />
          </section>
        )}
      </div>
    </div>
  )
}

export default SchoolScreen
