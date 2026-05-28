'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabaseClient'
import { Trip } from '@/types/database.types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

// ✅ Leaflet은 SSR 불가 → dynamic import로 CSR만 렌더링
const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      지도 로딩 중... 🗺️
    </div>
  ),
})

function MapContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // ✅ 쿼리 파라미터에서 좌표 읽기
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const initialCenter = lat && lng
    ? { lat: parseFloat(lat), lng: parseFloat(lng) }
    : { lat: 36.5, lng: 127.5 }
  const initialZoom = lat && lng ? 8 : 5


  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .returns<Trip[]>()

        if (data) setTrips(data)
      } catch (error) {
        console.error('여행 데이터 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrips()
  }, [])

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">로딩 중... ⏳</div>
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <MapComponent trips={trips} onTripClick={(slug) => router.push(`/trip/${slug}`)} />
      </main>
      <Footer />
    </div>
  )
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">로딩 중... ⏳</div>
    }>
      <MapContent />
    </Suspense>
  )
}