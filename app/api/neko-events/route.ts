import { NextRequest } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const CreateEventSchema = z.object({
  address: z.string().min(1),
  tokenId: z.number().int().positive(),
  action: z.enum(['adopt', 'feed', 'play']),
  txHash: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const json = await req.json()
  const parsed = CreateEventSchema.safeParse(json)

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { address, tokenId, action, txHash } = parsed.data

  const created = await prisma.nekoEvent.create({
    data: {
      address: address.toLowerCase(),
      tokenId,
      action,
      txHash,
    },
  })

  return Response.json({ ok: true, event: created })
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const address = url.searchParams.get('address')
  const tokenIdParam = url.searchParams.get('tokenId')

  if (!address || !tokenIdParam) {
    return Response.json(
      { ok: false, error: 'address and tokenId are required' },
      { status: 400 },
    )
  }

  const tokenId = Number(tokenIdParam)
  if (!Number.isFinite(tokenId) || tokenId <= 0) {
    return Response.json(
      { ok: false, error: 'invalid tokenId' },
      { status: 400 },
    )
  }

  const events = await prisma.nekoEvent.findMany({
    where: {
      address: address.toLowerCase(),
      tokenId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  const feedCount = events.filter((e: { action: string }) => e.action === 'feed').length

  return Response.json({
    ok: true,
    feedCount,
    events,
  })
}

