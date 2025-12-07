import Image from 'next/image'
import React from 'react'

export function LivingRoom() {
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
                src="catbox.gif"
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

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="flex-1 rounded-md bg-[#5D4037] px-3 py-2 text-[9px] text-[#FFF8E1] shadow-[0_2px_0_0_rgba(93,64,55,0.8)] active:translate-y-0.5 active:shadow-none"
            >
              feed snack 🍗
            </button>
            <button
              type="button"
              className="flex-1 rounded-md bg-[#A5D6A7] px-3 py-2 text-[9px] text-[#3E2723] shadow-[0_2px_0_0_rgba(93,64,55,0.6)] active:translate-y-0.5 active:shadow-none"
            >
              play yarn 🧶
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-1 text-[8px] text-[#8D6E63]">
          <p>all actions will later update on-chain needs like hunger, love, and hygiene.</p>
        </section>
      </div>
    </div>
  )
}

export default LivingRoom
