import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '보이스 호스트 - AI 오디오 가이드',
  description: '무인 숙소 게스트를 위한 초현실적 AI 오디오 가이드 웹 애플리케이션',
  keywords: ['AI', '음성', 'TTS', '숙박', '호스팅', '제주'],
  authors: [{ name: 'sosoroy' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
