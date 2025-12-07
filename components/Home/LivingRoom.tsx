'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { BASENEKO_NEKO_ABI, BASENEKO_NEKO_ADDRESS } from '@/lib/abis'

export function LivingRoom() {
  const { address } = useAccount()
  const [tokenIdInput, setTokenIdInput] = useState('1')
  const [lastAction, setLastAction] = useState<'feed' | 'play' | null>(null)
  const [feedCount, setFeedCount] = useState<number | null>(null)
  const [recentFeeds, setRecentFeeds] = useState<
    { id: number; txHash: string; createdAt: string }[]
  >([])

  const {
    writeContract,
    data: hash,
    isPending,
    error,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: 1,
    query: {
      enabled: Boolean(hash),
    },
  })

  const tokenIdNumber = Number(tokenIdInput)
  const hasValidTokenId = Number.isFinite(tokenIdNumber) && tokenIdNumber > 0

  async function refreshHistory() {
    if (!address || !hasValidTokenId) return

    try {
      const res = await fetch(
        `/api/neko-events?address=${address}&tokenId=${tokenIdNumber}`,
      )
      if (!res.ok) return
      const data = await res.json()
      if (data.ok) {
        setFeedCount(data.feedCount ?? 0)
        const feeds =
          (data.events as { id: number; action: string; txHash: string; createdAt: string }[]) ||
          []
        setRecentFeeds(
          feeds.filter((e) => e.action === 'feed').slice(0, 5),
        )
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    void refreshHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, tokenIdNumber])

  function handleAdopt() {
    writeContract({
      address: BASENEKO_NEKO_ADDRESS,
      abi: BASENEKO_NEKO_ABI,
      functionName: 'adopt',
      args: [],
    })
  }

  function handleCall(action: 'feed' | 'play') {
    if (!hasValidTokenId) {
      return
    }

    setLastAction(action)

    writeContract({
      address: BASENEKO_NEKO_ADDRESS,
      abi: BASENEKO_NEKO_ABI,
      functionName: action,
      args: [BigInt(tokenIdNumber)],
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

  // After a successful feed/play tx, record it in the Neon/Prisma DB
  useEffect(() => {
    async function logAndRefresh() {
      if (!isSuccess || !hash || !address || !hasValidTokenId || !lastAction) return

      try {
        await fetch('/api/neko-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            tokenId: tokenIdNumber,
            action: lastAction,
            txHash: hash,
          }),
        })
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
              src="/catbox.gif"
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
                src="/catbox.gif"
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

          <div className="mt-1 flex flex-col gap-1 text-[8px] text-[#5D4037]">
            <span className="text-[9px]">your neko id</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={tokenIdInput}
                onChange={(e) => setTokenIdInput(e.target.value)}
                className="baseneko-pill w-20 bg-[#FFF8E1] px-2 py-1 text-[9px] text-[#3E2723] outline-none"
              />
              <span className="text-[8px] text-[#8D6E63]">
                use the token id you adopted (e.g. 1). for now, check it in the Adopt event logs.
              </span>
            </div>
            <button
              type="button"
              onClick={handleAdopt}
              disabled={!address || isPending}
              className="mt-2 w-full rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              adopt a new neko ✨
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleCall('feed')}
              disabled={!address || !hasValidTokenId || isPending}
              className="flex-1 rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
            >
              feed snack 🍗
            </button>
            <button
              type="button"
              onClick={() => handleCall('play')}
              disabled={!address || !hasValidTokenId || isPending}
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
          <p>
            feed history:{' '}
            {feedCount === null ? 'loading…' : `your neko has been fed ${feedCount} time(s).`}
          </p>
          {recentFeeds.length > 0 && (
            <div className="rounded-2xl border-2 border-dashed border-[#BCAAA4] bg-[#FFFDE7] p-3 text-[#6D4C41]">
              <p className="mb-1 text-[9px] text-[#5D4037]">recent feed txs</p>
              <ul className="space-y-1">
                {recentFeeds.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      {e.txHash.slice(0, 6)}…{e.txHash.slice(-4)}
                    </span>
                    <span className="text-[7px] opacity-80">
                      {new Date(e.createdAt).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default LivingRoom
