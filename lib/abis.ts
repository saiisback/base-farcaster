export const BASENEKO_NEKO_ADDRESS = '0xE67B1D6A802f1f62cA2f5a042fc24501774C7D38' as const

export const BASENEKO_BADGES_ADDRESS = '0x4C600f148400f0D7Bdfefd6A4Cb5823D9cA21Aac' as const

export const BASENEKO_NEKO_ABI = [
  {
    type: 'function',
    name: 'adopt',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'feed',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'play',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
] as const

export const BASENEKO_BADGES_ABI = [
  {
    type: 'function',
    name: 'mintBadge',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const
