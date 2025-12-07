'use client'

import { useState } from 'react'

import { useFrame } from '@/components/farcaster-provider'
import { useAccount } from 'wagmi'
import { BottomNav, type BottomNavTab } from '@/components/Home/BottomNav'
import { LeaderboardScreen } from '@/components/Home/LeaderboardScreen'
import { LivingRoom } from '@/components/Home/LivingRoom'
import { LoginScreen } from '@/components/Home/LoginScreen'
import { SchoolScreen } from '@/components/Home/SchoolScreen'
import { SafeAreaContainer } from '@/components/safe-area-container'
import Navbar from '../Home/Navbar'

export default function Home() {
  const { context, isLoading, isSDKLoaded } = useFrame()
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<BottomNavTab>('living')

  if (isLoading) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 px-4">
          <h1 className="text-center text-xl font-bold text-[#5D4037]">Loading your neko…</h1>
        </div>
      </SafeAreaContainer>
    )
  }

  if (!isSDKLoaded) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 px-4">
          <h1 className="text-center text-sm font-bold text-[#5D4037]">
            No Farcaster SDK found. Please open this mini app inside the Farcaster client.
          </h1>
        </div>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="flex min-h-screen w-full flex-col bg-[#FFF8E1] text-[#5D4037]">
        <Navbar />
        <main className="flex flex-1 flex-col">
          {!isConnected && <LoginScreen />}
          {isConnected && activeTab === 'living' && <LivingRoom />}
          {isConnected && activeTab === 'school' && <SchoolScreen />}
          {isConnected && activeTab === 'leaderboard' && <LeaderboardScreen />}
        </main>
        {isConnected && <BottomNav active={activeTab} onChange={setActiveTab} />}
      </div>
    </SafeAreaContainer>
  )
}
