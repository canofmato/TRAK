import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 💡 타입스크립트를 위한 안전장치: 환경변수 값이 비어있다면 에러를 던져서 알려줍니다.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 환경 변수(URL 또는 Anon Key)가 누락되었습니다. .env.local 파일을 확인해주세요!')
}

// 이제 무조건 string 타입인 것이 보장되므로 빨간 줄이 사라집니다!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)