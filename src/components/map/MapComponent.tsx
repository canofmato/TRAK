'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Trip } from '@/types/database.types'

// ✅ Leaflet 기본 마커 아이콘 깨짐 수정
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

interface MapComponentProps {
  trips: Trip[]
  onTripClick: (slug: string) => void
  center?: { lat: number; lng: number }
  zoom?: number
}

function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [center.lat, center.lng, zoom, map])
  return null
}

export default function MapComponent({
    trips,
    onTripClick,
    center = { lat: 36.5, lng: 127.5 },
    zoom = 5,
  }: MapComponentProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon
  }, [])

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
    >
      <MapController center={center} zoom={zoom} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trips.map((trip) => (
        <Marker
          key={trip.id}
          position={[trip.latitude!, trip.longitude!]}
          icon={defaultIcon}
        >
          <Popup className="custom-popup">
            <div
              className="cursor-pointer"
              onClick={() => onTripClick(trip.slug)}
            >
              {/* 대표 이미지 */}
              <div className="w-[180px] h-[120px] overflow-hidden rounded-t-lg">
                {trip.cover_image_url ? (
                  <img
                    src={trip.cover_image_url}
                    alt={trip.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">이미지 없음</span>
                  </div>
                )}
              </div>

              {/* 텍스트 */}
              <div className="px-3 py-2 flex flex-col gap-1">
                <p className="font-bold text-sm text-black truncate">{trip.title}</p>
                <p className="text-xs text-gray-400">
                  {trip.start_date?.replace(/-/g, '.') ?? ''}
                  {trip.end_date ? ` ~ ${trip.end_date.replace(/-/g, '.')}` : ''}
                </p>
                {/* 클릭 유도 */}
                <p className="text-xs text-primary">→ 아카이브 보기</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}