import Map from "@/assets/icons/Map.svg"
import { Hashtag } from "../../common/Hashtag"
import { Trip } from  "@/types/database.types";
import Link from "next/link";

interface TripCardProps {
  trip: Trip;
  photoCount?: number; // 부모 컴포넌트에서 계산된 전체 사진 수
}

export default function TripCard({ trip, photoCount = 0 }: TripCardProps) {
  const tags = trip.hashtags || [];

  return (
    <article className="w-full h-full flex-1 bg-white flex gap-10">
      {/* Info */}
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-start gap-5 py-3 text-black">
          <div className="flex flex-col items-center justify-between">
            <p className="font-base">LOCATION</p>
            <span className="font-base font-semibold">{trip.location || '-'}</span>
          </div>

           <div className="flex flex-col items-center justify-between">
            <p className="font-base">MAP</p>
            <Link
              href="/map"
              aria-label="지도 보기"
            >
              <Map size={20}/>
            </Link>
            
          </div>

           <div className="flex flex-col items-center justify-between">
            <p className="font-base">PHOTOS</p>
            <span className="font-base font-semibold">{photoCount}</span>
          </div>
        </div>

        <div className="flex gap-[10px]">
          {tags.map((tag: string) => (
          <Hashtag 
            key={tag} 
            text={tag} 
          />
        ))}

        </div>

        <div className="w-full h-[200px] py-3">
          {trip.description || '작성된 설명이 없습니다.'}
        </div>
      </div>
    </article>
  )
}