import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="w-full border-b-4 border-[#5D4037] bg-[#FFF8E1] px-3 py-2">
      <div className="mx-auto flex max-w-sm items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-md border-2 border-[#5D4037] bg-[#FFE4B5]">
            <Image
              src="/Cat_Idle.gif"
              alt="Baseneko"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-wide text-[#5D4037]">
              baseneko
            </span>
            <span className="text-[10px] text-[#8D6E63]">
              the cozy base mini app
            </span>
          </div>
        </div>

        <div className="hidden text-[10px] text-[#5D4037] sm:block">
          🧶 nurture · learn · vibe
        </div>
      </div>
    </nav>
  )
}

export default Navbar