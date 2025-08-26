import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎤 보이스 호스트
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            무인 숙소 게스트를 위한 AI 오디오 가이드
          </p>
          <p className="text-lg text-gray-500">
            Higgs Audio v2로 만드는 따뜻한 디지털 호스팅 경험
          </p>
        </header>

        {/* 프로젝트 상태 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-green-600">✅ Sprint 0 완료</h3>
            </div>
            <p className="text-gray-600">
              배포 파이프라인 구축이 완료되었습니다. Replicate 모델 설정과 GitHub Actions 워크플로우가 준비되었습니다.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-blue-600">🔄 Sprint 1 진행 중</h3>
            </div>
            <p className="text-gray-600">
              백엔드 및 프론트엔드 UI 구축이 진행 중입니다. Supabase 스키마와 Edge Function이 준비되었습니다.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-gray-600">⏳ Sprint 2 대기</h3>
            </div>
            <p className="text-gray-600">
              기능 통합 및 완성 단계입니다. 프론트엔드와 백엔드 연동 후 최종 테스트를 진행합니다.
            </p>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="card-title">🚀 다음 단계</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Supabase 프로젝트 설정</h4>
                <p className="text-gray-600">
                  Supabase 대시보드에서 새 프로젝트를 생성하고, 데이터베이스 스키마를 적용하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">환경 변수 설정</h4>
                <p className="text-gray-600">
                  <code className="bg-gray-100 px-2 py-1 rounded">env.example</code>을 참고하여 
                  <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> 파일을 생성하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">개발 서버 실행</h4>
                <p className="text-gray-600">
                  <code className="bg-gray-100 px-2 py-1 rounded">npm install</code> 후 
                  <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>로 개발 서버를 시작하세요.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="card-title">🛠️ 기술 스택</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">백엔드</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Supabase (Database, Auth, Storage)</li>
                <li>• Supabase Edge Functions</li>
                <li>• Replicate (AI 모델 호스팅)</li>
                <li>• GitHub Actions (CI/CD)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">프론트엔드</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 14 (App Router)</li>
                <li>• React 18</li>
                <li>• Tailwind CSS</li>
                <li>• TypeScript</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 빠른 링크 */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link 
            href="/host" 
            className="btn-primary"
          >
            🧑‍💼 호스트 관리
          </Link>
          <Link 
            href="/guest" 
            className="btn-secondary"
          >
            🏕️ 게스트 플레이어
          </Link>
          <a 
            href="https://github.com/sosoroy/higgs-audio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            📚 GitHub 저장소
          </a>
        </div>
      </div>
    </main>
  )
}
