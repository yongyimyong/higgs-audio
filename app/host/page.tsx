'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ContentTemplate {
  id: string
  category: '필수정보' | '호스트스토리'
  contentType: string
  title: string
  textContent: string
  voiceStyle: string
  temperature: number
}

const voiceStyles = [
  { value: '따뜻하게', label: '따뜻하게' },
  { value: '활기차게', label: '활기차게' },
  { value: '차분하게', label: '차분하게' },
  { value: '전문적으로', label: '전문적으로' },
  { value: '친근하게', label: '친근하게' }
]

const contentTypes = {
  필수정보: ['와이파이', '환영메시지', '체크인', '체크아웃'],
  호스트스토리: ['숙소소개', '주변정보', '기타']
}

export default function HostPage() {
  const [activeTab, setActiveTab] = useState<'필수정보' | '호스트스토리'>('필수정보')
  const [templates, setTemplates] = useState<ContentTemplate[]>([
    {
      id: '1',
      category: '필수정보',
      contentType: '와이파이',
      title: 'Wi-Fi 정보',
      textContent: '와이파이 비밀번호는 [비밀번호]입니다. 연결에 문제가 있으시면 언제든 연락주세요.',
      voiceStyle: '전문적으로',
      temperature: 0.3
    },
    {
      id: '2',
      category: '필수정보',
      contentType: '환영메시지',
      title: '환영 메시지',
      textContent: '안녕하세요! [숙소명]에 오신 것을 환영합니다. 편안한 휴식을 즐기시기 바랍니다.',
      voiceStyle: '따뜻하게',
      temperature: 0.3
    },
    {
      id: '3',
      category: '호스트스토리',
      contentType: '숙소소개',
      title: '숙소 소개',
      textContent: '우리 숙소는 [위치]에 위치해 있어요. [특징]을 감상하실 수 있습니다.',
      voiceStyle: '친근하게',
      temperature: 0.3
    }
  ])

  const [generatingAudio, setGeneratingAudio] = useState<string | null>(null)

  const handleGenerateAudio = async (templateId: string) => {
    setGeneratingAudio(templateId)
    
    try {
      // TODO: Supabase Edge Function 호출
      console.log('음성 생성 시작:', templateId)
      
      // 임시로 3초 대기
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      console.log('음성 생성 완료:', templateId)
    } catch (error) {
      console.error('음성 생성 실패:', error)
    } finally {
      setGeneratingAudio(null)
    }
  }

  const handleTemplateUpdate = (templateId: string, field: keyof ContentTemplate, value: any) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId ? { ...template, [field]: value } : template
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🧑‍💼 호스트 관리
              </h1>
              <p className="text-gray-600">
                숙소 오디오 가이드를 관리하고 음성을 생성하세요
              </p>
            </div>
            <Link 
              href="/" 
              className="btn-secondary"
            >
              ← 메인으로
            </Link>
          </div>
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

        {/* 콘텐츠 영역 */}
        <div className="grid gap-6">
          {templates
            .filter(template => template.category === activeTab)
            .map(template => (
              <div key={template.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.title}
                    </h3>
                    <div className="space-y-4">
                      {/* 텍스트 내용 */}
                      <div className="form-group">
                        <label className="form-label">텍스트 내용</label>
                        <textarea
                          className="form-textarea h-24"
                          value={template.textContent}
                          onChange={(e) => handleTemplateUpdate(template.id, 'textContent', e.target.value)}
                          placeholder="오디오로 변환할 텍스트를 입력하세요..."
                        />
                      </div>

                      {/* 음성 스타일 및 온도 */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">음성 스타일</label>
                          <select
                            className="form-select"
                            value={template.voiceStyle}
                            onChange={(e) => handleTemplateUpdate(template.id, 'voiceStyle', e.target.value)}
                          >
                            {voiceStyles.map(style => (
                              <option key={style.value} value={style.value}>
                                {style.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">생성 온도 (0.1-1.0)</label>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.1"
                            className="w-full"
                            value={template.temperature}
                            onChange={(e) => handleTemplateUpdate(template.id, 'temperature', parseFloat(e.target.value))}
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            {template.temperature} (낮을수록 일관성, 높을수록 다양성)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 음성 생성 버튼 */}
                  <div className="ml-6">
                    <button
                      onClick={() => handleGenerateAudio(template.id)}
                      disabled={generatingAudio === template.id}
                      className={`btn-primary min-w-[120px] ${
                        generatingAudio === template.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {generatingAudio === template.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          생성 중...
                        </div>
                      ) : (
                        '🎤 음성 생성'
                      )}
                    </button>
                  </div>
                </div>

                {/* 미리듣기 영역 (나중에 구현) */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-500">
                    생성된 오디오가 여기에 표시됩니다
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* QR 코드 생성 버튼 */}
        <div className="mt-8 text-center">
          <button className="btn-success">
            📱 QR 코드 생성
          </button>
        </div>
      </div>
    </div>
  )
}
