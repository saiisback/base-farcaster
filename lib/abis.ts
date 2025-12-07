export const BASENEKO_NEKO_ADDRESS = '0xE67B1D6A802f1f62cA2f5a042fc24501774C7D38' as const

export const BASENEKO_BADGES_ADDRESS = '0x3BFbC647D8809eD43246Efd79F2aeB44eFd2E3d5' as const

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
  {
    type: 'function',
    name: 'mintBadgeForAchievement',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'achievement', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'badgeLabel',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'label', type: 'string' }],
  },
] as const
