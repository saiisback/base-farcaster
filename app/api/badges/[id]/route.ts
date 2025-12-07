import type { NextRequest } from 'next/server'

// Minimal ERC-1155 metadata endpoint for Baseneko badges.
// Base URI you can use in the contract:
//   https://pur-base.vercel.app/api/badges/{id}.json
// OpenZeppelin's ERC1155 will replace {id} with the hex-encoded token id.

function getBadgeMetadata(id: string) {
  // Normalize id to decimal string for our switch; you can expand this later.
  // Depending on how marketplaces pass it, `id` may already be hex; handle both.
  let numericId: number | null = null

  if (id.startsWith('0x')) {
    numericId = Number.parseInt(id, 16)
  } else {
    const n = Number(id)
    numericId = Number.isFinite(n) ? n : null
  }

  if (!numericId || numericId <= 0) {
    return {
      name: `Baseneko Badge #${id}`,
      description: 'A Baseneko achievement badge.',
      image: 'https://pur-base.vercel.app/images/badges/default.png',
    }
  }

  switch (numericId) {
    case 1:
      return {
        name: 'the tutor',
        description: 'Awarded for teaching your neko their first lesson.',
        image: 'https://pur-base.vercel.app/images/badges/the-tutor.png',
      }
    case 2:
      return {
        name: 'neko caretaker',
        description: 'Awarded for consistent feeding and play sessions.',
        image: 'https://pur-base.vercel.app/images/badges/neko-caretaker.png',
      }
    default:
      return {
        name: `Baseneko Badge #${numericId}`,
        description: 'A Baseneko achievement badge.',
        image: 'https://pur-base.vercel.app/images/badges/default.png',
      }
  }
}

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params
  const meta = getBadgeMetadata(id)

  return Response.json(meta, {
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  })
}
