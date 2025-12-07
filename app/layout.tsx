import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'

import { Providers } from '@/components/providers'
import './globals.css'

const pixelFont = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Base Farcaster MiniApp Template',
  description: 'A template for building mini-apps on Farcaster and Base',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
