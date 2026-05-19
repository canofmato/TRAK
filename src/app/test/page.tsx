"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient' 
// 🔥 Supabase에서 제공하는 진짜 User 타입을 가져옵니다.
import { User } from '@supabase/supabase-js'

export default function SupabaseTestPage() {
  const [status, setStatus] = useState('⏳ Supabase 백엔드에 신호 보내는 중...')
  // 💡 <any> 대신 <User | null>을 적어주면 감시관이 기쁘게 통과시켜 줍니다.
  const [user, setUser] = useState<User | null>(null) 

  useEffect(() => {
    // 1. DB 연결 체크
    async function checkConnection() {
      const { data, error } = await supabase.from('trips').select('*')
      if (error) {
        setStatus(`❌ 백엔드 연결 실패... 에러 메시지: ${error.message}`)
      } else {
        setStatus('✅ 대성공! Supabase 백엔드와 완벽하게 연결되었습니다.')
      }
    }
    
    // 2. 현재 로그인한 유저가 있는지 체크
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    checkConnection()
    checkUser()

    // 3. 로그인 상태가 바뀌면 실시간으로 감지해서 user 상태 업데이트
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 🔥 구글 로그인 함수
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/test`, 
      },
    })
    
    if (error) alert(`구글 로그인 실패: ${error.message}`)
  }

  // 🚪 로그아웃 함수
  const handleLogout = async () => {
    await supabase.auth.signOut()
    alert('로그아웃 되었습니다!')
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>백엔드 연결 및 로그인 테스트 센터 🧪</h1>
      <hr style={{ margin: '20px auto', width: '400px', borderColor: '#eee' }} />
      
      <p style={{ fontSize: '16px', fontWeight: 'bold', color: status.includes('대성공') ? '#10b981' : '#ef4444' }}>
        {status}
      </p>

      <div style={{ margin: '40px auto', padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', maxWidth: '450px', backgroundColor: '#f9fafb' }}>
        {!user ? (
          <div>
            <p style={{ marginBottom: '20px', color: '#4b5563' }}>아직 로그인하지 않은 상태입니다.</p>
            <button 
              onClick={handleGoogleLogin}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
              Google 계정으로 로그인
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '20px' }}>🎉 구글 로그인 성공!</p>
            
            <img 
              src={user.user_metadata?.avatar_url} 
              alt="프로필" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px', border: '2px solid #10b981' }} 
            />
            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{user.user_metadata?.full_name}님 환영합니다!</h3>
            <p style={{ margin: '0 0 20px 0', color: '#6b7280', fontSize: '14px' }}>{user.email}</p>
            
            <button 
              onClick={handleLogout}
              style={{ width: '100%', padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  )
}