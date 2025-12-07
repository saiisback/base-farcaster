import React, { useEffect, useState } from 'react'

type Leader = {
  address: string
  lessons: number
  events: number
  avgScore: number
  totalScore: number
}

export function LeaderboardScreen() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/leaderboard')
        if (!res.ok) {
          throw new Error('failed to load leaderboard')
        }
        const data = (await res.json()) as { ok?: boolean; leaders?: Leader[]; error?: string }
        if (!data.ok || !data.leaders) {
          throw new Error(data.error || 'invalid leaderboard response')
        }
        if (!cancelled) {
          setLeaders(data.leaders)
        }
      } catch (e) {
        if (!cancelled) {
          setError('could not load leaderboard yet.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="baseneko-graph-paper flex w-full flex-1 items-stretch justify-center px-3 pb-4 pt-3 overflow-y-auto">
      <div className="flex w-full max-w-sm flex-1 flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-xs text-[#5D4037]">leaderboard</h1>
          <p className="text-[9px] text-[#8D6E63]">
            see which neko parents have cared the most across on-chain actions and study sessions.
          </p>
        </header>

        <section className="baseneko-card flex w-full flex-col gap-2 rounded-2xl p-4 text-[9px] text-[#5D4037]">
          {isLoading && <p className="text-[8px] text-[#8D6E63]">loading leaderboard…</p>}
          {error && !isLoading && (
            <p className="text-[8px] text-[#D32F2F]">{error}</p>
          )}
          {!isLoading && !error && leaders.length === 0 && (
            <p className="text-[8px] text-[#8D6E63]">
              no lessons or on-chain actions recorded yet. be the first to feed, play, and teach your
              neko.
            </p>
          )}
          {!isLoading &&
            !error &&
            leaders.length > 0 &&
            leaders.map((entry, index) => (
              <div
                key={entry.address}
                className="flex items-center justify-between rounded-xl bg-[#FFFDE7] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                  </span>
                  <span className="font-mono text-[8px] text-[#3E2723]">
                    {entry.address.slice(0, 6)}…{entry.address.slice(-4)}
                  </span>
                </div>
                <div className="flex flex-col items-end text-[8px] text-[#6D4C41]">
                  <span>care score: {entry.totalScore}</span>
                  <span className="opacity-80">
                    {entry.lessons} lesson(s) · {entry.events} on-chain event(s)
                  </span>
                </div>
              </div>
            ))}
        </section>

        <section className="flex flex-col gap-1 text-[8px] text-[#8D6E63]">
          <p>
            leaderboard combines your study sessions with feed/play events into a single care score.
          </p>
        </section>
      </div>
    </div>
  )
}

export default LeaderboardScreen
