'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface AudioItem {
  id: string
  title: string
  category: '필수정보' | '호스트스토리'
  duration: number
  audioUrl?: string
  isPlaying: boolean
}

export default function GuestPage() {
  const [activeTab, setActiveTab] = useState<'필수정보' | '호스트스토리'>('필수정보')
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [audioItems] = useState<AudioItem[]>([
    {
      id: '1',
      title: 'Wi-Fi 정보',
      category: '필수정보',
      duration: 15,
      isPlaying: false
    },
    {
      id: '2',
      title: '환영 메시지',
      category: '필수정보',
      duration: 25,
      isPlaying: false
    },
    {
      id: '3',
      title: '체크인 안내',
      category: '필수정보',
      duration: 20,
      isPlaying: false
    },
    {
      id: '4',
      title: '숙소 소개',
      category: '호스트스토리',
      duration: 30,
      isPlaying: false
    },
    {
      id: '5',
      title: '주변 정보',
      category: '호스트스토리',
      duration: 35,
      isPlaying: false
    }
  ])

  const handlePlayAudio = (item: AudioItem) => {
    // 이전 오디오 정지
    if (currentAudio && currentAudio.id !== item.id) {
      audioItems.forEach(audio => audio.isPlaying = false)
    }

    // 새 오디오 재생
    setCurrentAudio(item)
    setIsPlaying(true)
    
    // 실제 오디오 재생 (임시)
    console.log('오디오 재생:', item.title)
    
    // 임시로 3초 후 정지
    setTimeout(() => {
      setIsPlaying(false)
      setCurrentAudio(null)
    }, 3000)
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏕️ 오디오 가이드
          </h1>
          <p className="text-gray-600">
            숙소 정보를 편안하게 들어보세요
          </p>
        </header>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {(['필수정보', '호스트스토리'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === '필수정보' ? '🏠 필수 정보' : '🧡 호스트 스토리'}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 오디오 목록 */}
        <div className="grid gap-4 mb-8">
          {audioItems
            .filter(item => item.category === activeTab)
            .map(item => (
              <div 
                key={item.id} 
                className={`card cursor-pointer transition-all duration-200 ${
                  currentAudio?.id === item.id ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-lg'
                }`}
                onClick={() => handlePlayAudio(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentAudio?.id === item.id && isPlaying 
                        ? 'bg-primary-500 text-white animate-pulse' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {currentAudio?.id === item.id && isPlaying ? (
                        <div className="flex space-x-1">
                          <div className="w-1 h-3 bg-white rounded animate-pulse"></div>
                          <div className="w-1 h-3 bg-white rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-3 bg-white rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      ) : (
                        <span className="text-xl">▶️</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatTime(item.duration)} • {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {currentAudio?.id === item.id && isPlaying ? '재생 중...' : '클릭하여 재생'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* 미니 플레이어 */}
        {currentAudio && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <div>
                    <h4 className="font-semibold text-gray-900">{currentAudio.title}</h4>
                    <p className="text-sm text-gray-500">{currentAudio.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 flex-1 max-w-md">
                  <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || currentAudio.duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">{formatTime(duration || currentAudio.duration)}</span>
                </div>

                <button
                  onClick={() => {
                    setCurrentAudio(null)
                    setIsPlaying(false)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 숨겨진 오디오 엘리먼트 */}
        <audio
          ref={audioRef}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime)
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration)
            }
          }}
          onEnded={() => {
            setIsPlaying(false)
            setCurrentAudio(null)
          }}
        />

        {/* 하단 링크 */}
        <div className="text-center mt-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
