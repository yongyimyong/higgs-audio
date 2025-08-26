# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: voice-host
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: 가장 가까운 지역 선택

## 2. 데이터베이스 스키마 적용

1. Supabase 대시보드에서 "SQL Editor" 접속
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행
3. 모든 테이블과 함수가 성공적으로 생성되었는지 확인

## 3. Storage 버킷 생성

1. "Storage" 메뉴 접속
2. "New bucket" 클릭
3. **Bucket name**: `audio-files`
4. **Public bucket**: 체크 (오디오 파일 공개 접근 필요)
5. "Create bucket" 클릭

## 4. Edge Function 배포

1. "Edge Functions" 메뉴 접속
2. "New function" 클릭
3. **Function name**: `generate-audio`
4. `supabase/functions/generate-audio/index.ts` 내용을 복사하여 붙여넣기
5. "Deploy" 클릭

## 5. 환경 변수 설정

Edge Function에 다음 환경 변수를 추가:

- `REPLICATE_API_TOKEN`: Replicate API 토큰
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 롤 키

## 6. API 키 확인

Settings → API에서 다음 정보를 확인하여 `.env.local` 파일에 추가:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 7. 테스트

모든 설정이 완료되면 다음 명령어로 테스트:

```bash
npm install
npm run dev
```

그 후 `http://localhost:3000`에서 애플리케이션 확인
