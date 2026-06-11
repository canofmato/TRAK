'use client'

import { TabBar } from "@/components/layout/TabBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Trip } from "@/types/database.types";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/common/Button";
import Link from "next/link";
import ConfirmModal from "@/components/common/ConfirmModal";
import Loading from "@/components/common/Loading";

interface Profile {
  id: string;
  nickname: string | null;
  email: string | null;
  avatar_url: string| null;
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          router.push("/login");
          return;
        }

        // 프로필 가져오기
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profileData) setProfile(profileData);

        // 여행 목록 최신순으로 가져오기
        const { data: tripsData } = await supabase
          .from("trips")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (tripsData) setTrips(tripsData);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header />

      {/* main */}
      <main className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        {/* TabBar*/}
        <div className="w-full z-10">
          <TabBar />
        </div>

        {/* content */}
        <section className="w-full lg:h-[600px] flex items-center p-10 bg-white">
          <div className="w-full h-full flex flex-col items-end justify-between border border-2 border-dashed border-dark">
            {/* 프로필 */}
            <div className="w-full flex items-center justify-between p-6 border-b-2 border-dashed border-dark">
              <div className="flex items-center gap-4">
                <div className="w-[100px] h-[100px] rounded-full border border-light bg-light overflow-hidden shrink-0">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover"
                    />
                  ): (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-black text-subtitle-md font-medium">{profile?.nickname ?? '여행자'}</p>
                  <p className="text-black text-body">{profile?.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-5">
                <Button
                  variant="filled"
                  sizeVariant="ss"
                  onClick={() => router.push(`/profile/edit`)}
                >
                  수정
                </Button>
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="text-base text-gray-300 hover:text-black transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>

            {/* 여행 카드 */}
            <div className="w-full flex flex-col px-6 py-5">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-black font-semibold text-subtitle-md">My Travel</h2>
                <Button
                  type="button"
                  variant="primary"
                  sizeVariant="sm"
                  onClick={() => router.push(`/create`)}
                >
                  아카이브 만들기
                </Button>
              </div>
              
              {trips.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center gap-4 py-10">
                  <p className="text-body text-gray-300">여행 아카이브가 없습니다.</p>
                  <Button
                    variant="outlined"
                    sizeVariant="sm"
                    onClick={() => router.push(`/create`)}
                  >
                    첫 여행 만들기
                  </Button>
                </div>
              ): (
                <ul className="w-full flex py-5 gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {trips.map((trip) => {
                    const startDate = trip.start_date?.replace(/-/g, '.') ?? ''
                    const endDate = trip.end_date?.replace(/-/g, '.') ?? ''

                    return (
                      <li key={trip.id} className="shrink-0 w-[180px]">
                        <Link href={`/trip/${trip.slug}`} className="flex flex-col gap-2 group">
                          {/* 커버 이미지 */}
                          <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-200">
                            {trip.cover_image_url ? (
                              <img
                                src={trip.cover_image_url}
                                alt={trip.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          {/* 제목 & 날짜 */}
                          <div className="flex flex-col gap-0.5">
                            <p className="text-body font-semibold text-black truncate">
                              {trip.title}
                            </p>
                            <p className="text-base text-gray-300">
                              {startDate && endDate
                                ? `${startDate} ~ ${endDate}`
                                : startDate || '날짜 미정'}
                            </p>
                          </div>
                        </Link>

                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

          </div>
        </section>

      </main>

      <Footer />
      {isLogoutModalOpen && (
        <ConfirmModal
          isLoading={isLoggingOut}
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutModalOpen(false)}
          title="로그아웃 하시겠습니까?"
          description="언제든지 다시 로그인할 수 있어요."
          confirmLabel="로그아웃"
          loadingLabel="로그아웃 중..."
          confirmVariant="delete"
        />
      )}
    </div>
  )
}
