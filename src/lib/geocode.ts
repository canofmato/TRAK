export async function geocodeLocation(
  location: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          // Nominatim 정책상 User-Agent 필수
          'User-Agent': 'TRAK-travel-app'
        }
      }
    )
    const data = await res.json()
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
    return null
  } catch (error) {
    console.error('좌표 변환 실패:', error)
    return null
  }
}