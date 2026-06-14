# TRAK

TRAK은 여행을 SNS 피드처럼 흘려보내지 않고, 다시 꺼내볼 수 있는 개인 여행 아카이브로 정리하는 웹 애플리케이션입니다. 여행 단위로 기록을 만들고, 폴더별로 사진을 모아두며, 위치 정보가 있는 여행은 지도 위에서 한눈에 확인할 수 있습니다.

## 주요 기능

- 이메일/비밀번호 및 Google OAuth 기반 로그인
- 여행 아카이브 생성, 조회, 수정, 삭제
- 여행별 대표 이미지, 기간, 위치, 설명, 해시태그, 컬러 저장
- 여행 안에 사진 폴더 생성 및 최대 30장 사진 업로드
- HEIC 이미지 자동 변환 후 업로드
- 위치명 기반 좌표 변환 및 지도 마커 표시
- 프로필 조회, 수정, 아바타 업로드, 로그아웃
- 비밀번호 찾기 및 재설정

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Database, Storage, Edge Functions
- React Hook Form
- Zustand
- Leaflet, React Leaflet

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 Supabase 프로젝트 정보를 입력합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 사용 가능한 스크립트

```bash
npm run dev
```

개발 서버를 실행합니다.

```bash
npm run build
```

프로덕션 빌드를 생성합니다.

```bash
npm run start
```

빌드된 앱을 프로덕션 모드로 실행합니다.

```bash
npm run lint
```

ESLint 검사를 실행합니다.

## Supabase 준비 사항

앱을 로컬에서 정상 동작시키려면 Supabase에 다음 리소스가 필요합니다.

### Tables

- `profiles`: 사용자 프로필 정보
- `trips`: 여행 아카이브 정보
- `photo_folders`: 여행별 사진 폴더
- `photos`: 폴더별 사진 정보

### Storage Buckets

- `avatars`: 프로필 이미지
- `trip-covers`: 여행 대표 이미지
- `photos`: 여행 폴더 사진

### Edge Functions

- `check-email-exists`: 회원가입/로그인 화면에서 이메일 가입 여부를 확인하는 함수

Google 로그인과 비밀번호 재설정을 사용하려면 Supabase Auth의 OAuth Provider, Redirect URL, Email 설정도 함께 구성해야 합니다.

## 프로젝트 구조

```text
src/
  app/                 # App Router 기반 페이지
  assets/              # 로고와 아이콘 리소스
  components/          # 공통 UI, 레이아웃, 페이지 컴포넌트
  lib/                 # Supabase 클라이언트, 위치 변환, 이미지 변환 유틸
  store/               # Zustand 상태 관리
  types/               # 앱에서 사용하는 TypeScript 타입
public/                # 정적 파일
```

## 주요 페이지

- `/`: 서비스 소개 랜딩 페이지
- `/login`, `/signup`: 인증 페이지
- `/main`: 로그인 후 메인 화면
- `/create`: 여행 아카이브 생성
- `/trip/[tripSlug]`: 여행 상세
- `/trip/[tripSlug]/create-folder`: 여행 폴더 생성
- `/trip/[tripSlug]/[folderName]`: 폴더별 사진 상세
- `/map`: 여행 위치 지도
- `/profile`: 내 프로필과 여행 목록
- `/info`: 약관, 블로그, 문의 안내

## 메모

TRAK은 사용자의 여행 기록을 개인적으로 쌓아두는 데 초점을 둔 서비스입니다. 지도 기능은 OpenStreetMap 타일과 Nominatim 위치 검색을 사용하며, 위치 검색 요청 정책을 고려해 사용량과 요청 빈도를 관리하는 것이 좋습니다.
