'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { base } from '@reown/appkit/networks'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import {
  BASENEKO_BADGES_ABI,
  BASENEKO_BADGES_ADDRESS,
  BASENEKO_NEKO_ABI,
  BASENEKO_NEKO_ADDRESS,
} from '@/lib/abis'

export function LivingRoom() {
  const { address } = useAccount()
        const [lastAction, setLastAction] = useState<'feed' | 'play' | null>(null)
  const [feedCount, setFeedCount] = useState<number | null>(null)
  const [recentFeeds, setRecentFeeds] = useState<
    { id: number; txHash: string; createdAt: string }[]
  >([])
  const [validationError, setValidationError] = useState<string | null>(null)

  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract()
  const { writeContract: writeBadges } = useWriteContract()

  const { data: tutorBalance } = useReadContract({
    address: BASENEKO_BADGES_ADDRESS,
    abi: BASENEKO_BADGES_ABI,
    functionName: 'balanceOf',
    args: address ? [address, 1n] : undefined,
    query: {
      enabled: Boolean(address),
    },
  })

  const { data: caretakerBalance } = useReadContract({
    address: BASENEKO_BADGES_ADDRESS,
    abi: BASENEKO_BADGES_ABI,
    functionName: 'balanceOf',
    args: address ? [address, 2n] : undefined,
    query: {
      enabled: Boolean(address),
    },
  })

  const hasTutorBadge = (tutorBalance ?? 0n) > 0n
  const hasCaretakerBadge = (caretakerBalance ?? 0n) > 0n

  const { data: myBalance, isLoading: isTokenLoading } = useReadContract({
    address: BASENEKO_NEKO_ADDRESS,
    abi: BASENEKO_NEKO_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: Boolean(address),
    },
  })

  const hasNeko = (myBalance ?? 0n) > 0n

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
    query: {
      enabled: Boolean(hash),
    },
  })

  // history is disabled while tokenId is internal; feed/play still work on-chain
  const refreshHistory = () => {}

  function handleAdopt() {
    writeContract({
      chainId: base.id,
      address: BASENEKO_NEKO_ADDRESS,
      abi: BASENEKO_NEKO_ABI,
      functionName: 'adopt',
      args: [],
    })
  }

  function handleCall(action: 'feed' | 'play') {
    if (!address) {
      setValidationError('connect a wallet first.')
      return
    }
    if (!hasNeko) {
      setValidationError('adopt a neko first.')
      return
    }

    setLastAction(action)

    writeContract({
      chainId: base.id,
      address: BASENEKO_NEKO_ADDRESS,
      abi: BASENEKO_NEKO_ABI,
      functionName: action,
      args: [address],
    })
  }

  let txStatus = 'no on-chain actions yet.'
  if (isPending) {
    txStatus = 'sending tx to base…'
  } else if (isConfirming) {
    txStatus = 'neko is waiting for block confirmation…'
  } else if (isSuccess) {
    txStatus = 'neko action confirmed on-chain!'
  }

  if (error) {
    txStatus = 'something went wrong, neko could not act.'
  }
  if (validationError) {
    txStatus = validationError
  } else if (isTokenLoading) {
    txStatus = 'checking your neko…'
  }

  useEffect(() => {
    async function logAndRefresh() {
      if (!isSuccess || !hash || !address || !hasNeko || !lastAction) return

      try {
        // skipping event logging because tokenId is internal-only now
      } catch {
        // ignore logging error; on-chain tx is still valid
      } finally {
        setLastAction(null)
        void refreshHistory()
      }
    }

    void logAndRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash])

  return (
    <div className="baseneko-graph-paper flex w-full flex-1 items-stretch justify-center px-3 pb-4 pt-3 overflow-y-auto">
      <div className="flex w-full max-w-sm flex-1 flex-col gap-4">
        <header className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border-4 border-[#5D4037] bg-[#FFE4B5]">
            <Image
              src="/Catbox.gif"
              alt="Relaxed pixel neko"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xs text-[#5D4037]">living room</h1>
            <p className="text-[9px] text-[#8D6E63]">
              check on your neko, read its mood, and choose what to do next.
            </p>
          </div>
        </header>

        <section className="baseneko-card rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative h-20 w-24 rounded-2xl border-4 border-[#5D4037] bg-[#FFE4B5]">
              <Image
                src="/Catbox.gif"
                alt="Neko in a cozy room"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 text-[9px] text-[#5D4037]">
              <p>
                today your neko feels <span className="font-bold">curious</span> and a little
                <span className="font-bold">hungry</span>.
              </p>
              <p>decide if it&apos;s snack time or study time.</p>
            </div>
          </div>

          <div className="mt-1 flex flex-col gap-2 text-[8px] text-[#5D4037]">
            <div className="flex items-center justify-between gap-2">
              <span>hunger</span>
              <div className="relative h-3 flex-1 baseneko-pill overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-2/3 bg-[#EF5350]/80" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span>happiness</span>
              <div className="relative h-3 flex-1 baseneko-pill overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-4/5 bg-[#A5D6A7]/90" />
              </div>
            </div>
          </div>

          <div className="mt-1 flex flex-col gap-2 text-[8px] text-[#5D4037]">
            <div className="flex items-center justify-between rounded-lg bg-[#FFF8E1] px-3 py-2">
              <span className="text-[9px] font-semibold">your neko</span>
              <span className="text-[9px] text-[#3E2723]">
                {hasNeko ? 'owned' : 'none yet'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdopt}
              disabled={!address || isPending || hasNeko}
              className="w-full rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              {hasNeko ? 'you already adopted a neko' : 'adopt your neko ✨'}
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleCall('feed')}
              disabled={!address || !hasNeko || isPending}
              className="flex-1 rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              feed snack 🍗
            </button>
            <button
              type="button"
              onClick={() => handleCall('play')}
              disabled={!address || !hasNeko || isPending}
              className="flex-1 rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              play yarn 🧶
            </button>
          </div>

          <div className="mt-2 rounded-xl border-2 border-dashed border-[#BCAAA4] bg-[#FFFDE7] p-3 text-[8px] text-[#6D4C41]">
            <p className="mb-1">
              tx status:{' '}
              <span className="font-semibold text-[#5D4037]">
                {txStatus}
              </span>
            </p>
            {hash && (
              <button
                type="button"
                className="mt-1 rounded-md bg-[#FFF8E1] px-2 py-1 text-[8px] text-[#3E2723] underline"
                onClick={() =>
                  window.open(
                    `https://basescan.org/tx/${hash}`,
                    '_blank',
                  )
                }
              >
                view on basescan
              </button>
            )}
            {error && (
              <p className="mt-1 text-[8px] text-[#D32F2F]">
                {error.message.slice(0, 120)}
              </p>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-2 text-[8px] text-[#8D6E63]">
          <p>feed history is disabled because token IDs are internal now.</p>
        </section>

        {address && (
          <section className="baseneko-card mt-1 flex flex-col gap-2 rounded-2xl p-4 text-[8px] text-[#5D4037]">
            <p className="text-[9px] font-normal">your badges</p>
            {!hasTutorBadge && !hasCaretakerBadge && (
              <p className="text-[8px] text-[#8D6E63]">
                no badges yet. teach your neko a lesson or care for it to earn badges.
              </p>
            )}
            {hasTutorBadge && (
              <div className="flex items-center justify-between rounded-xl bg-[#FFFDE7] px-3 py-2">
                <span className="text-[9px] font-semibold">the tutor</span>
                <span className="text-[8px] text-[#6D4C41]">earned from school lessons</span>
              </div>
            )}
            {hasCaretakerBadge && (
              <div className="flex items-center justify-between rounded-xl bg-[#FFFDE7] px-3 py-2">
                <span className="text-[9px] font-semibold">neko caretaker</span>
                <span className="text-[8px] text-[#6D4C41]">earned from feeding your neko</span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default LivingRoom
