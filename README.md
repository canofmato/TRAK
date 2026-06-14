# TRAK

TRAK은 여행의 순간을 흘려보내지 않고, 다시 꺼내볼 수 있는 개인 여행 아카이브로 정리하는 웹 애플리케이션입니다.

여행이 끝나고 나면 사진은 갤러리에 쌓이고, 기억은 메모장과 SNS 타임라인 사이에 흩어지기 쉽습니다. TRAK은 그런 기록을 여행 단위로 묶고, 폴더와 사진, 위치, 날짜, 감정의 단서들을 함께 보관할 수 있도록 만든 서비스입니다.

좋아요나 팔로워를 위한 공개 피드가 아니라, 사용자가 자신의 여행을 조용히 정리하고 다시 돌아볼 수 있는 개인적인 기록 공간을 지향합니다.

## 프로젝트 소개

TRAK의 기록 구조는 `Trip -> Folder -> Photo` 흐름을 따릅니다.

하나의 여행은 독립된 아카이브가 되고, 그 안에서 장소나 일정, 테마에 따라 사진 폴더를 만들 수 있습니다. 각 여행에는 대표 이미지, 여행 기간, 위치, 설명, 해시태그, 컬러를 지정할 수 있어 단순한 사진 목록이 아니라 하나의 여행 카드처럼 관리됩니다.

위치 정보가 있는 여행은 지도 위에 마커로 표시됩니다. 사용자는 지도에서 자신이 다녀온 여행지를 훑어보고, 특정 여행의 상세 기록으로 바로 이동할 수 있습니다.

## 이런 문제를 해결합니다

- 여행 사진이 휴대폰 갤러리에만 쌓여 나중에 찾기 어려운 문제
- SNS에 올리지 않은 개인적인 여행 기록이 흩어지는 문제
- 여행별로 사진, 날짜, 장소, 설명을 함께 정리하기 어려운 문제
- 내가 다녀온 장소를 지도 위에서 한눈에 보고 싶은 니즈
- 보여주기보다 보관하기에 가까운 여행 기록 공간의 필요

## 주요 사용자 흐름

1. 계정을 만들고 로그인합니다.
2. 여행 제목, 기간, 위치, 설명, 대표 이미지, 해시태그를 입력해 새 아카이브를 만듭니다.
3. 여행 안에 폴더를 만들고 사진을 업로드합니다.
4. 여행 상세 페이지에서 폴더별 사진과 여행 정보를 확인합니다.
5. 지도 페이지에서 좌표가 저장된 여행을 위치 기반으로 탐색합니다.
6. 프로필 페이지에서 내 정보와 내가 만든 여행 아카이브를 관리합니다.

## 주요 기능

- 이메일/비밀번호 및 Google OAuth 기반 로그인
- 회원가입, 이메일 중복 확인, 비밀번호 찾기 및 재설정
- 여행 아카이브 생성, 조회, 수정, 삭제
- 여행별 대표 이미지, 기간, 위치, 설명, 해시태그, 컬러 저장
- 위치명 기반 좌표 변환 및 지도 마커 표시
- 여행별 사진 폴더 생성, 수정, 삭제
- 폴더별 다중 사진 업로드 및 사진 설명 관리
- HEIC 이미지 자동 변환 후 업로드
- 프로필 조회, 수정, 아바타 업로드, 로그아웃
- 로딩, 토스트, 확인 모달 등 공통 UI 피드백

## 화면 구성

- `/`: TRAK의 컨셉을 소개하는 랜딩 페이지
- `/login`, `/signup`: 로그인과 회원가입
- `/find`, `/reset-password`: 비밀번호 찾기와 재설정
- `/main`: 로그인 후 진입하는 메인 화면
- `/create`: 새 여행 아카이브 생성
- `/trip/[tripSlug]`: 여행 상세 페이지
- `/trip/[tripSlug]/edit`: 여행 정보 수정
- `/trip/[tripSlug]/create-folder`: 여행 안에 사진 폴더 생성
- `/trip/[tripSlug]/[folderName]`: 폴더별 사진 상세
- `/trip/[tripSlug]/[folderName]/edit`: 폴더 정보와 사진 수정
- `/map`: 여행 위치 지도
- `/profile`: 내 프로필과 여행 목록
- `/profile/edit`: 프로필 수정
- `/info`: 약관, 블로그, 문의 안내

<details>
<summary>개발자용 정보 보기</summary>

## 기술 스택

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Database, Storage, Edge Functions
- React Hook Form
- Zustand
- Leaflet, React Leaflet
- browser-image-compression, heic2any

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

## 메모

지도 기능은 OpenStreetMap 타일과 Nominatim 위치 검색을 사용합니다. Nominatim은 요청 정책을 가지고 있으므로 운영 환경에서는 요청 빈도와 캐싱 전략을 함께 고려하는 것이 좋습니다.

</details>

## 배포 링크

- Service: 🔗 [TRAK](https://trak-self.vercel.app)

## Contact

- Email: 📧 gunmannduu@gmail.com
