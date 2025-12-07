'use client'

import Image from 'next/image'
import React from 'react'
import { useAccount } from 'wagmi'

import { useFrame } from '@/components/farcaster-provider'
import { WalletActions } from '@/components/Home/WalletActions'

export function LoginScreen() {
  const { context } = useFrame()
  const { isConnected, address } = useAccount()

  const displayName = context?.user?.displayName ?? context?.user?.username

  return (
    <div className="baseneko-graph-paper flex w-full flex-1 items-stretch justify-center px-3 pb-4 pt-3 overflow-y-auto">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-between gap-4">
        <header className="flex w-full items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border-4 border-[#5D4037] bg-[#FFE4B5]">
              <Image
                src="/catbox.gif"
                alt="Baseneko curled up in a box"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xs leading-snug text-[#5D4037]">
                baseneko
              </h1>
              <p className="text-[9px] leading-snug text-[#8D6E63]">
                the next gen neko.{' '}
                <span className="block">
                  feed your mind, evolve your pet.
                </span>
              </p>
            </div>
          </div>
          <div className="hidden flex-col items-end text-[8px] text-[#5D4037] sm:flex">
            <span>on&nbsp;🔵 base sepolia</span>
            <span>for farcaster miniapps</span>
          </div>
        </header>

        <main className="flex w-full flex-1 flex-col items-stretch justify-start gap-4">
          <section className="flex items-center justify-center">
            <div className="relative h-32 w-40 rounded-2xl border-4 border-[#5D4037] bg-[#FFE4B5] sm:h-36 sm:w-44">
              <Image
                src="/cat_Idle.gif"
                alt="Running pixel neko"
                fill
                className="object-contain"
              />
            </div>
          </section>

          <section className="baseneko-card flex w-full flex-col gap-3 rounded-2xl p-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-[11px] text-[#5D4037]">
                {isConnected ? 'welcome back, neko parent!' : 'log in to your neko'}
              </h2>
              <p className="text-[9px] leading-relaxed text-[#6D4C41]">
                {isConnected
                  ? 'your neko is waiting in the living room. tap below to manage your wallet & start caring.'
                  : 'connect your wallet inside farcaster to adopt, feed, and play with your on‑chain neko.'}
              </p>
              {displayName && (
                <p className="baseneko-pill inline-flex items-center gap-1 px-3 py-1 text-[9px] text-[#5D4037]">
                  <span className="text-[10px]">🪪</span>
                  <span>signed in as {displayName}</span>
                </p>
              )}
              {isConnected && address && (
                <p className="mt-1 text-[8px] text-[#8D6E63]">
                  wallet: <span className="bg-[#FFF8E1] px-1">{address}</span>
                </p>
              )}
            </div>

            <div className="mt-1">
              <WalletActions />
            </div>
          </section>

          <section className="flex flex-col items-center gap-2 pb-1 text-[8px] text-[#6D4C41]">
            <p>tip: solve cozy quizzes in the classroom to earn snacks for your neko.</p>
            <p>all caring actions are on-chain on base sepolia.</p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default LoginScreen

