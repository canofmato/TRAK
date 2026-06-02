'use client'

import { TabBar } from "@/components/layout/TabBar";
import { Header } from "@/components/layout/Header";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PhotoFolder, Photo, Trip } from "@/types/database.types";
import { supabase } from "@/lib/supabaseClient";
import FolderMoreDropdown from "@/components/Page/trip/FolderMoreDropdown";
import Link from "next/link";
import Loading from "@/components/common/Loading";
import { Footer } from "@/components/layout/Footer";

export default function FolderPage() {
  const params = useParams();
  const router = useRouter();

  const tripSlug = Array.isArray(params.tripSlug) ? params.tripSlug[0] : params.tripSlug ?? ''
  const folderName = Array.isArray(params.folderName) ? params.folderName[0] : params.folderName ?? ''

  const [folder, setFolder] = useState<PhotoFolder | null>(null);
  const [trip, setTrip] = useState<Trip |null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tripSlug || !folderName) return;

    const fetchData = async () => {
      // tripSlug로 trip 가져오기
      try {
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('slug', tripSlug)
          .single()
        
        if (tripError || !tripData) throw tripError

        setTrip(tripData)

        // folderName으로 폴더 가져오기
        const { data: folderData, error: folderError } = await supabase
          .from('photo_folders')
          .select('*')
          .eq('trip_id', tripData.id)
          .eq('slug', folderName)
          .single()

        if (folderError || !folderData) throw folderError

        setFolder(folderData)

        // 폴더안의 사진들 가져오기
        const { data: photoData, error: photoError } = await supabase
          .from('photos')
          .select('*')
          .eq('folder_id', folderData.id)
          .order('display_order', { ascending: true })

        if (!photoError && photoData) {
          setPhotos(photoData)
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData();
  }, [tripSlug, folderName])

  if (isLoading) {
    return <Loading />
  }

  if (!folder || !trip) {
    return <div className="w-full h-screen flex items-center justify-center">데이터를 찾을 수 없습니다.</div>
  }


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
          <div className="w-full flex flex-col items-start gap-5 p-4 border border-2 border-dashed border-dark bg-white">

            {/* 상단 */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-10">
                <h1 className="font-semibold text-black text-heading-md">{folder.name}</h1>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-gray-300 text-base">Trip</span>
                  <Link 
                    href={`/trip/${tripSlug}`}
                    className="rounded-[30px] px-2 py-1 bg-primary text-black text-base"
                  >
                    {trip.title}
                  </Link>
                </div>
              </div>
              <FolderMoreDropdown
                folderId={folder.id}
                tripSlug={tripSlug}
                folderSlug={folderName}
              />
            </div>

            {/* 설명 */}
            {folder.description && (
              <div className="w-full flex flex-col gap-2 rounded-[10px] bg-gray-100 p-3">
                <p className="text-base text-gray-300">PHOTO INFO</p>
                <p className="text-body text-black whitespace-pre-wrap">{folder.description}</p>
              </div>
            )}

            {/* 사진 */}
            <div className="w-full flex flex-col gap-2">
              <p className="text-subtitle-md font-semibold text-black">Photos ({photos.length})</p>
              {photos.length === 0 ? (
                <div className="w-full h-[200px] flex items-center justify-center text-gray-300 text-body">
                  아직 사진이 없어요.
                </div>
              ): (
                <ul className="w-full grid grid-cols-3 lg:grid-cols-5 gap-3">
                  {photos.map((photo) => (
                    <li
                      key={photo.id}
                      className="relative aspect-square rounded-lg overflow-hidden cursor-pointer
                                 hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={photo.image_url}
                        alt={photo.description ?? '사진'}
                        className="w-full h-full object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}
