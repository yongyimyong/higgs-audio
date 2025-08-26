# 보이스 호스트 (Voice Host) - v2.0 (Final MVP)

**프로젝트명**: 보이스 호스트 (Voice Host)  
**버전**: 2.0 (MVP 최종안)  
**작성일**: 2025년 8월 26일  
**프로젝트 ID**: fe74270d-8007-4ae1-8d44-a0c50d004635

## 1. 개요 (Overview) 🗺️

보이스 호스트는 무인 숙소 게스트를 위한 초현실적 AI 오디오 가이드 웹 애플리케이션이다. Higgs Audio v2 모델의 표현력 높은 음성 생성 능력을 활용하여, 게스트에게는 따뜻하고 효율적인 경험을, 호스트에게는 간편한 비대면 관리 솔루션을 제공하는 것을 목표로 한다.

### 핵심 기술 파이프라인

- **AI 모델**: boson-ai/higgs-audio-v2
- **AI 호스팅**: Replicate
- **배포 자동화 (CI/CD)**: GitHub Actions
- **백엔드**: Supabase (DB, Auth, Storage, Edge Functions)
- **프론트엔드**: React (UI는 v0.dev로 신속 개발)
- **로컬 개발 위치**: C:\Users\dream\.cursor\JEJU\

## 2. 사용자 스토리 및 핵심 기능 (User Stories & Features) 🎯

### A. 🧑‍💼 호스트 (Host)

**EPIC**: 나는 내 숙소만의 특별한 오디오 가이드를 5분 안에 만들고 싶다.

#### 기능 1: 콘텐츠 템플릿
- 관리 페이지에서 **[필수 정보]**와 [호스트 스토리] 탭을 통해 체계적으로 콘텐츠를 관리한다.
- 각 탭에는 [와이파이], [환영 메시지] 등 미리 정의된 텍스트 입력란이 제공된다.

#### 기능 2: AI 음성 스타일 지정
- 각 텍스트 입력란 옆에 [음성 스타일] 드롭다운 메뉴를 제공한다.
- 따뜻하게, 활기차게, 차분하게 등 Higgs Audio의 표현력을 활용할 수 있는 옵션을 선택하여 오디오 분위기를 직접 지정한다.

#### 기능 3: 원클릭 음성 생성
- [음성 생성] 버튼을 누르면, Supabase Edge Function이 Replicate API를 호출하여 텍스트와 스타일을 기반으로 음성 파일을 생성하고 Supabase Storage에 자동 저장한다.

### B. 🏕️ 투숙객 (Guest)

**EPIC**: 나는 숙소에 도착하자마자 모든 정보를 쉽고 편안하게 듣고 싶다.

#### 기능 1: QR코드를 통한 즉시 접속
- 숙소에 비치된 QR코드 스캔 시, 앱 설치나 로그인 없이 즉시 오디오 가이드 페이지에 접속한다.

#### 기능 2: 직관적인 오디오 플레이어
- **[🏠 필수 정보]**와 [🧡 호스트 스토리] 두 개의 명확한 카테고리 중에서 원하는 주제를 선택하여 청취한다.
- 오디오 재생 중에도 다른 목록을 탐색할 수 있는 미니 플레이어를 제공한다.

## 3. 기술 아키텍처 및 개발 로드맵 (Architecture & Roadmap) 🚀

### 아키텍처 흐름

1. **개발**: 로컬(C:\...)에서 개발 후 higgs-audio Fork 저장소에 predict.py, replicate.yaml 등 설정 파일을 포함하여 코드를 git push.
2. **자동 배포**: GitHub Actions가 코드 변경을 감지하고, Replicate에 모델을 자동으로 빌드 및 배포하여 API 엔드포인트를 생성/업데이트.
3. **음성 생성**: 호스트가 앱에서 [음성 생성] 버튼 클릭 → Supabase Edge Function이 Replicate API 호출 → 생성된 음성 파일을 Supabase Storage에 저장.
4. **가이드 청취**: 게스트가 앱 접속 → Supabase DB에서 음성 파일 URL을 읽어와 재생.

### 개발 로드맵 (Sprints)

#### ✅ Sprint 0: 배포 파이프라인 구축 (완료)
- [x] boson-ai/higgs-audio GitHub 저장소를 sosoroy 계정으로 Fork.
- [x] Fork한 저장소에 **predict.py**와 replicate.yaml 파일 생성 및 설정.
- [x] Replicate 웹사이트에서 모델 '빈 껍데기' 생성 (sosoroy/higgs-audio-guide).
- [x] GitHub 저장소 Settings > Secrets에 REPLICATE_CLI_AUTH_TOKEN 등록.
- [x] .github/workflows/ 폴더에 배포용 YAML 파일을 추가하고, 수동 실행하여 Replicate에 첫 배포를 성공시킨다. (실사용 가능한 API 엔드포인트 확보)

#### 🔄 Sprint 1: 백엔드 및 프론트엔드 UI 구축 (진행 중)
- [x] Supabase 프로젝트 생성, DB 스키마 설계 및 Auth 설정.
- [ ] v0.dev를 사용하여 호스트용 관리 페이지와 게스트용 플레이어 페이지의 UI 컴포넌트를 신속하게 생성.

#### ⏳ Sprint 2: 기능 통합 및 완성 (대기)
- [ ] 프론트엔드 UI와 Supabase DB 연동.
- [ ] 호스트 관리 페이지의 [음성 생성] 버튼과 Supabase Edge Function을 연동하여 Sprint 0에서 만든 Replicate API 호출 기능 구현.
- [ ] End-to-End 테스트 및 최종 배포.

## 4. 기술 스택 상세

### AI 모델: boson-ai/higgs-audio-v2-generation-3B-base
- **모델 크기**: 5.77B params
- **특징**: 
  - 10M+ 시간의 오디오 데이터로 사전 훈련
  - 감정 표현력이 뛰어난 음성 생성
  - EmergentTTS-Eval에서 GPT-4o-mini-tts 대비 75.7% 승률 (감정 카테고리)
  - 다국어 지원 및 멀티스피커 대화 생성 가능

### 개발 환경
- **로컬 개발**: C:\Users\dream\.cursor\JEJU\
- **버전 관리**: GitHub
- **배포**: Replicate + GitHub Actions
- **백엔드**: Supabase
- **프론트엔드**: React + v0.dev

## 5. 프로젝트 구조

```
voice-host/
├── README.md                 # 프로젝트 문서
├── package.json              # Node.js 의존성
├── next.config.js            # Next.js 설정
├── tailwind.config.js        # Tailwind CSS 설정
├── postcss.config.js         # PostCSS 설정
├── env.example               # 환경 변수 예시
├── replicate/                # Replicate 모델 설정
│   ├── predict.py            # 음성 생성 로직
│   └── replicate.yaml        # 모델 설정
├── supabase/                 # Supabase 설정
│   ├── schema.sql            # 데이터베이스 스키마
│   └── functions/            # Edge Functions
│       └── generate-audio/   # 음성 생성 API
└── .github/workflows/        # GitHub Actions
    └── deploy-replicate.yml  # 자동 배포 워크플로우
```

## 6. 다음 단계 (Next Steps)

### Sprint 1 완료를 위한 작업:
1. **Supabase 프로젝트 설정**
   - Supabase 대시보드에서 새 프로젝트 생성
   - `supabase/schema.sql` 실행하여 데이터베이스 스키마 생성
   - Storage 버킷 'audio-files' 생성
   - Edge Function 'generate-audio' 배포

2. **환경 변수 설정**
   - `env.example`을 참고하여 `.env.local` 파일 생성
   - Supabase URL, API 키, Replicate API 토큰 설정

3. **프론트엔드 UI 개발**
   - v0.dev를 사용하여 호스트 관리 페이지 생성
   - v0.dev를 사용하여 게스트 플레이어 페이지 생성
   - Tailwind CSS 스타일링 적용

### Sprint 2 완료를 위한 작업:
1. **기능 통합**
   - 프론트엔드와 Supabase 연동
   - 음성 생성 버튼과 Edge Function 연동
   - 오디오 플레이어 구현

2. **테스트 및 배포**
   - End-to-End 테스트
   - 프로덕션 배포

## 7. 프로젝트 상태

- [x] PRD 작성 완료
- [x] Sprint 0: 배포 파이프라인 구축
- [ ] Sprint 1: 백엔드 및 프론트엔드 UI 구축  
- [ ] Sprint 2: 기능 통합 및 완성
