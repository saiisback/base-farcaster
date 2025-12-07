import React from 'react'

const MOCK_LEADERS = [
  { place: 1, name: '@cozyparent', score: 128 },
  { place: 2, name: '@mathneko', score: 96 },
  { place: 3, name: '@sleepycat', score: 72 },
]

export function LeaderboardScreen() {
  return (
    <div className="baseneko-graph-paper flex w-full flex-1 items-stretch justify-center px-3 pb-4 pt-3 overflow-y-auto">
      <div className="flex w-full max-w-sm flex-1 flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-xs text-[#5D4037]">leaderboard</h1>
          <p className="text-[9px] text-[#8D6E63]">
            see which neko parents have cared the most on-chain.
          </p>
        </header>

        <section className="baseneko-card flex w-full flex-col gap-2 rounded-2xl p-4 text-[9px] text-[#5D4037]">
          {MOCK_LEADERS.map((entry) => (
            <div
              key={entry.place}
              className="flex items-center justify-between rounded-xl bg-[#FFFDE7] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px]">
                  {entry.place === 1 ? '🥇' : entry.place === 2 ? '🥈' : '🥉'}
                </span>
                <span>{entry.name}</span>
              </div>
              <span className="text-[8px] text-[#6D4C41]">care score: {entry.score}</span>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-1 text-[8px] text-[#8D6E63]">
          <p>
            once wired up, this list will be powered by real on-chain feed/play events and badges.
          </p>
        </section>
      </div>
    </div>
  )
}

export default LeaderboardScreen
