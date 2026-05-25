
'use client'
import { TabBar } from "@/components/layout/TabBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import TripImage from "@/components/Page/trip/TripImage";
import FolderGrid from "@/components/Page/trip/FolderGrid";
import TripCard from "@/components/Page/trip/TripCard";
import { supabase } from "@/lib/supabaseClient";
import { Trip, PhotoFolder } from "@/types/database.types";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTabStore } from "@/store/tabStore";
import MoreDropdown from "@/components/Page/MoreDropdonw";

export default function TripPage() {
  const params = useParams();
  const tripSlug = params?.tripSlug as string;

  // 1. 상태 관리
  const [trip, setTrip] = useState<Trip | null>(null);
  const [folders, setFolders] = useState<PhotoFolder[]>([]);
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pinTab = useTabStore((state) => state.pinTab);

  // 2. 데이터 불러오기 로직
  useEffect(() => {
    if (!tripSlug) return;

    const fetchTripData = async () => {
      try {
        // [A] 여행 정보 가져오기
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('slug', tripSlug)
          .single();

        if (tripError) throw tripError;

        if (tripData) {
          setTrip(tripData);

          pinTab({
            tripSlug: tripData.slug,
            title: tripData.title,
            color: tripData.color ?? '#D7E8F8',
            coverImageUrl: tripData.cover_image_url ?? null,
          })

          // [B] 해당 여행의 폴더 목록 가져오기
          const { data: folderData, error: folderError } = await supabase
            .from('photo_folders')
            .select('*')
            .eq('trip_id', tripData.id)
            .order('created_at', { ascending: true });

          if (!folderError && folderData) {
            setFolders(folderData);

            // [C] 폴더 내 사진 개수 합산 (선택 사항: 카운트 로직)
            const folderIds = folderData.map(f => f.id);
            if (folderIds.length > 0) {
              const { count, error: countError } = await supabase
                .from('photos')
                .select('*', { count: 'exact', head: true })
                .in('folder_id', folderIds);

              if (!countError && count !== null) {
                setPhotoCount(count);
              }
            }
          }
        }
      } catch (error) {
        console.error("데이터 로딩 중 에러 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripData();
  }, [tripSlug, pinTab]);

  // 로딩 및 데이터 없을 때의 예외 처리
  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">로딩 중... ⏳</div>;
  }
  if (!trip) {
    return <div className="w-full h-screen flex items-center justify-center">데이터를 찾을 수 없습니다.</div>;
  }

  // 날짜 형식 예쁘게 변환 (ex. 2026-02-04 -> 2026.02.04)
  const startDate = trip.start_date?.replace(/-/g, '.') || '';
  const endDate = trip.end_date?.replace(/-/g, '.') || '';

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header/>
      <main  className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        <div className="w-full z-10">
          <TabBar/>
        </div>
        {/* content */}
        <section 
          className="w-full flex items-center p-10"
          style={{ backgroundColor: trip.color || '#D7E8F8' }}
        >
          <div className="w-full flex flex-col items-start gap-5 p-4 border border-2 border-dashed border-dark">
            {/* 상단 영역 */}
            <div className="w-full flex flex-col lg:flex-row gap-5 items-stretch">
              <div className="w-full lg:w-[40%] shrink-0">
                <TripImage src={trip.cover_image_url} alt={trip.title}/>
              </div>

              {/* 제목 & 콘텐츠 영역 */}
              <div className="w-full lg:w-[60%] flex flex-col gap-4">
                <header className="flex justify-between items-center text-white">
                  <div>
                    <h1 className="font-semibold text-white text-heading-md">{trip.title}</h1>
                    <p className="font-semibold text-white text-base">{startDate} ~ {endDate}</p>
                  </div>
                  <MoreDropdown tripId={trip.id} tripSlug={tripSlug} />
                </header>

                {/* 태블릿 전용: 폴더 영역 */}
                <div className="block lg:hidden w-full mt-2">
                  <FolderGrid folders={folders}/>
                </div>

                {/* 데스크탑 전용: 통합 카드 (정보 + 카드) */}
                <div className="hidden lg:flex w-full flex-1 bg-white px-3 gap-8 items-center justify-between">
                  <div className="w-full h-full">
                    <TripCard trip={trip} photoCount={photoCount} />
                  </div>
                  <div className="shrink-0 h-full flex items-center">
                    <FolderGrid folders={folders}/>
                  </div>
                </div>
              </div>
            </div>
            {/* 하단 영역: 테블릿 전용 */}
            <div className="flex lg:hidden w-full bg-white">
              <TripCard trip={trip} photoCount={photoCount}/>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}