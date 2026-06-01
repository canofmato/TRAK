
'use client'
import { ColorPalette } from "@/components/common/ColorPalette/ColorPalette";
import { TabBar } from "@/components/layout/TabBar";
import { Header } from "@/components/layout/Header";
import { useEffect, useState } from "react";
import type { TrakColor } from "@/components/common/ColorPalette/ColorSwatch";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import ImageUploadInput from "@/components/Page/trip/ImageUploadInput";
import HashtagInput from "@/components/common/HashtagInput";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useForm, SubmitHandler } from "react-hook-form";
import type { Trip } from "@/types/database.types";
import { useTabStore } from "@/store/tabStore";

interface EditTripFormValues {
  title: string;
  location:string;
  start_at:string;
  end_at: string;
  description: string;
}

const generateSlug = (title: string) => {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // 한글 등 비 ASCII 전부 제거
    .replace(/\s+/g, "-")             // 공백을 하이픈으로 변경
    .replace(/-+/g, "-")              // 중복 하이픈 축소
    .replace(/^-|-$/g, "")        // 앞뒤 하이픈 제거

  // 순수 한글 제목이면 base가 빈 문자열 → trip으로 fallback
  const safeBase = base || "trip"

  return `${safeBase}-${Date.now().toString().slice(-5)}`
};

const hasChanges = (
  original: Trip,
  watched: EditTripFormValues,
  color: string,
  coverImageUrl: string,
  hashtags: string[]
): boolean => {
  return (
    original.title !== watched.title ||
    original.location !== (watched.location || null) ||
    original.start_date !== (watched.start_at || null) ||
    original.end_date !== (watched.end_at || null) ||
    original.description !== (watched.description || null) ||
    original.color !== (color || null) ||
    original.cover_image_url !== (coverImageUrl || null) ||
    JSON.stringify(original.hashtags) !== JSON.stringify(hashtags)
  );
};

function FormButtons({ isLoading, isChanged, onCancel}: { isLoading: boolean; isChanged: boolean; onCancel: () => void}) {
  return (
    <div className="flex w-full items-center justify-between gap-6 ">
      <Button type="button" variant="outlined" sizeVariant="sm" className="shrink-0" onClick={onCancel}>
        취소
      </Button>
      <Button type="submit" variant="filled" sizeVariant="md" disabled={!isChanged || isLoading} isActive={isChanged}>
        {isLoading ? "생성 중..." : "아카이브 수정하기"}
      </Button>
    </div>
  );
}

export default function EditTripPage() {
  const router = useRouter();
  const params = useParams();
  const tripSlug = Array.isArray(params.tripSlug) 
    ? params.tripSlug[0] 
    : params.tripSlug ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [tripId, setTripId] = useState<string>("");

  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");

  const [snapshot, setSnapshot] = useState<Trip | null>(null);

  const pinTab = useTabStore((state) => state.pinTab);
  const removeTab = useTabStore((state) => state.removeTab)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditTripFormValues>({
    mode: "onChange"
  });

  const watchedValues = watch();

  const isChanged = snapshot
    ? hasChanges(snapshot, watchedValues, dropdownValue, coverImageUrl, hashtags)
    : false;
  
    useEffect(()=> {
      if (!tripSlug) return;

      const fetchTrip = async () => {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("slug", tripSlug)
          .single();

          if (error || !data) {
            setIsFetching(false);
            return;
          }

        reset({
          title: data.title ?? "",
          location: data.location ?? "",
          start_at: data.start_date ?? "",
          end_at: data.end_date ?? "",
          description: data.description ?? "",
        });

        setTripId(data.id);
        setDropdownValue(data.color ?? "");
        setHashtags(data.hashtags ?? []);
        setCoverImageUrl(data.cover_image_url ?? "");
        setSnapshot(data);
        setIsFetching(false);
      };
      fetchTrip();
    }, [tripSlug, reset]);

  const onSubmit: SubmitHandler<EditTripFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }

      const titleChanged = snapshot?.title !== data.title;
      const newSlug = titleChanged ? generateSlug(data.title) : tripSlug;

      const { error: updateError } = await supabase
        .from("trips")
        .update({
          title: data.title,
          slug: newSlug,
          description: data.description || null,
          location: data.location || null,
          start_date: data.start_at || null,
          end_date: data.end_at || null,
          cover_image_url: coverImageUrl || null,
          color: dropdownValue || null,
          hashtags: hashtags,
        })
        .eq("id", tripId);
      
      if (updateError) throw updateError

      if (titleChanged) {
        removeTab(tripSlug);
      }

      pinTab({
        tripSlug: newSlug,
        title: data.title,
        color: dropdownValue || "#D7E8F8",
        coverImageUrl: coverImageUrl || null,
      });

      router.push(`/trip/${newSlug}`);

    } catch (error) {
      console.error("여행 수정 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="w-full h-screen flex items-center justify-center">로딩 중... ⏳</div>;
  }

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header/>
      <main  className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        <div className="w-full z-10">
          <TabBar/>
        </div>
        {/* content */}
        <section className="w-full flex items-center p-10 bg-white">
          <div className="w-full flex flex-col items-start gap-5 p-4 border border-2 border-dashed border-dark">

            {/* title */}
            <div className="flex py-1 gap-3 items-center">
              <ColorPalette 
                mode="dropdown"
                value={dropdownValue}
                onChange={(color: TrakColor) => setDropdownValue(color.hex)}
              />
              <h1 className="text-subtitle-lg text-medium">아카이브 수정하기</h1>
            </div>

            {/* create form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-start gap-6">
              <div className="w-full flex flex-row items-stretch gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-[30%] lg:w-[420px] h-full flex flex-col items-start gap-5">
                  <ImageUploadInput
                    label="대표 이미지"
                    name="cover_image_url"
                    initialUrl={coverImageUrl}
                    onUploadSuccess={(url) => setCoverImageUrl(url)}
                  />
                  
                  <HashtagInput
                    label="해시태그"
                    value={hashtags}
                    onChange={setHashtags}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-3 items-stretch justify-between">
                  <div className="flex flex-col lg:flex-row w-full gap-3">
                    <Input
                      name="title"
                      label="제목"
                      placeholder="예: HONGKONG"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                      register={register("title", { required: "여행 제목은 필수 항목입니다." })}
                      errors={errors}
                    />
                    <Input
                      name="location"
                      label="장소"
                      placeholder="예: HONGKONG"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                      register={register("location")}
                      errors={errors}
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row w-full gap-3">
                    <Input
                      name="start_at"
                      label="시작일"
                      placeholder="예: YYYY-MM-DD"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                      register={register("start_at")}
                      errors={errors}
                    />
                    <Input
                      name="end_at"
                      label="종료일"
                      placeholder="예: YYYY-MM-DD"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                      register={register("end_at")}
                      errors={errors}
                    />
                  </div>
                  <Textarea
                    name="description"
                    label="설명"
                    placeholder="여행에 대한 설명을 입력하세요."
                    sizeVariant="lg"
                    register={register("description")}
                  />
                  <div className="hidden lg:block w-full">
                    <FormButtons 
                      isLoading={isLoading}
                      isChanged={isChanged}
                      onCancel={() => router.push(`/trip/${tripSlug}`)}
                    />
                  </div>
                </div>
              </div>
              <div className="block lg:hidden w-full">
                <FormButtons
                  isLoading={isLoading}
                  isChanged={isChanged}
                  onCancel={() => router.push(`/trip/${tripSlug}`)}
                />
              </div>
              
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
