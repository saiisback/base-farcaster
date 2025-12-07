import Image from 'next/image'
import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Home, School, Trophy } from 'lucide-react'

export type BottomNavTab = 'living' | 'school' | 'leaderboard'

const items: { id: BottomNavTab; label: string; icon: LucideIcon }[] = [
  {
    id: 'living',
    label: 'Living Room',
    icon: Home,
  },
  {
    id: 'school',
    label: 'School',
    icon: School,
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
  },
]

interface BottomNavProps {
  active: BottomNavTab
  onChange: (tab: BottomNavTab) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="w-full border-t-4 border-[#5D4037] bg-[#FFF8E1]/95 px-3 py-2">
      <div className="mx-auto flex max-w-sm items-center justify-between gap-2">
        {items.map((item) => {
          const isActive = item.id === active
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 baseneko-pill px-2 py-1 text-[9px] leading-tight shadow-[0_2px_0_0_rgba(93,64,55,0.7)] active:translate-y-0.5 active:shadow-none ${
                isActive ? 'bg-[#A5D6A7] text-[#3E2723]' : 'bg-[#FFF8E1] text-[#5D4037]'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.5} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
