import { prisma } from '@/lib/prisma'

function computeScore(params: { lessons: number; avgScore: number; events: number }) {
  const { lessons, avgScore, events } = params
  // Simple scoring: lessons are worth more than raw events
  // tweak these weights later if you like
  return lessons * 10 + events * 2 + Math.round(avgScore)
}

export async function GET() {
  // Some environments might still have an older Prisma client without NekoLesson.
  // In that case, fall back to an events-only leaderboard instead of crashing.
  const hasLessonModel =
    (prisma as any).nekoLesson && typeof (prisma as any).nekoLesson.groupBy === 'function'

  const lessonStats = hasLessonModel
    ? await (prisma as any).nekoLesson.groupBy({
        by: ['address'],
        _count: { id: true },
        _avg: { score: true },
      })
    : []

  const eventStats = await prisma.nekoEvent.groupBy({
    by: ['address'],
    _count: { id: true },
  })

  const byAddress = new Map<
    string,
    { address: string; lessons: number; avgScore: number; events: number; totalScore: number }
  >()

  for (const row of lessonStats as {
    address: string
    _count: { id: number }
    _avg: { score: number | null }
  }[]) {
    const address = row.address.toLowerCase()
    const lessons = row._count.id
    const avgScore = Number(row._avg.score ?? 0)
    const existing = byAddress.get(address) ?? {
      address,
      lessons: 0,
      avgScore: 0,
      events: 0,
      totalScore: 0,
    }

    const mergedLessons = existing.lessons + lessons
    const mergedAvgScore =
      mergedLessons === 0
        ? 0
        : (existing.avgScore * existing.lessons + avgScore * lessons) / mergedLessons

    const updated = {
      ...existing,
      lessons: mergedLessons,
      avgScore: mergedAvgScore,
    }
    updated.totalScore = computeScore({
      lessons: updated.lessons,
      avgScore: updated.avgScore,
      events: updated.events,
    })
    byAddress.set(address, updated)
  }

  for (const row of eventStats) {
    const address = row.address.toLowerCase()
    const events = row._count.id
    const existing = byAddress.get(address) ?? {
      address,
      lessons: 0,
      avgScore: 0,
      events: 0,
      totalScore: 0,
    }

    const updated = {
      ...existing,
      events: existing.events + events,
    }
    updated.totalScore = computeScore({
      lessons: updated.lessons,
      avgScore: updated.avgScore,
      events: updated.events,
    })
    byAddress.set(address, updated)
  }

  const leaders = Array.from(byAddress.values())
    .filter((row) => row.lessons > 0 || row.events > 0)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)

  return Response.json({ ok: true, leaders })
}
