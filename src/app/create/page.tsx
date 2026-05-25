
'use client'
import { ColorPalette } from "@/components/common/ColorPalette/ColorPalette";
import { TabBar } from "@/components/layout/TabBar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import type { TrakColor } from "@/components/common/ColorPalette/ColorSwatch";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import ImageUploadInput from "@/components/Page/trip/ImageUploadInput";
import HashtagInput from "@/components/common/HashtagInput";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useForm, SubmitHandler } from "react-hook-form";

interface CreateTripFormValues {
  title: string;
  location:string;
  start_at:string;
  end_at: string;
  description: string;
}

function FormButtons({ isLoading}: { isLoading: boolean}) {
  return (
    <div className="flex w-full items-center justify-between gap-6 ">
      <Button type="button" variant="outlined" sizeVariant="sm" className="shrink-0">
        취소
      </Button>
      <Button type="submit" variant="filled" sizeVariant="md">
        {isLoading ? "생성 중..." : "아카이브 만들기"}
      </Button>
    </div>
  );
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

export default function CreatePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dropdownValue, setDropdownValue] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTripFormValues>({
    mode: "onChange"
  });

  // 🔥 [핵심] 아카이브 생성 요청 (Supabase Insert)
  const onSubmit: SubmitHandler<CreateTripFormValues> = async (data) => {
    setIsLoading(true);

    try {
      // 1. 현재 로그인한 유저 정보 가져오기 (user_id 채우기용)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        router.push("/login");
        return;
      }

      // 2. 제목 기반 slug 생성
      const tripSlug = generateSlug(data.title);

      // 3. Supabase 'trips' 테이블에 데이터 꽂아넣기 🚀
      const { data: insertedData, error: insertError } = await supabase
        .from("trips")
        .insert({
          user_id: user.id,                      // RLS 및 역정규화용 유저 ID
          title: data.title,
          slug: tripSlug,                        // 자동 생성된 UNIQUE 슬러그
          description: data.description,
          location: data.location,
          start_date: data.start_at || null,     // 비어있으면 null 처리
          end_date: data.end_at || null,
          cover_image_url: coverImageUrl || null, // 업로드된 이미지 URL
          color: dropdownValue || null,          // ColorPalette 컴포넌트 hex 값 바인딩
          hashtags: hashtags,                    // text[] 배열 타입 그대로 바인딩
          latitude: 37.5665,                     // 💡 추후 Places Autocomplete 연동 시 동적 데이터로 교체
          longitude: 126.9780,                   // 💡 추후 Places Autocomplete 연동 시 동적 데이터로 교체
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      alert("새로운 여행 아카이브가 성공적으로 만들어졌습니다! 🎉");
      console.log("생성된 여행 데이터:", insertedData);
      
      // 성공 후 대시보드나 상세 페이지로 이동
      router.push(`/trip/${tripSlug}`);

    } catch (error) {
      if (error instanceof Error) {
        alert(`아카이브 생성 실패... ❌ \n사유: ${error.message}`);
      } else {
        alert("알 수 없는 에러가 발생했습니다.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="flex px-3 py-1 gap-3 items-center">
              <ColorPalette 
                mode="dropdown"
                value={dropdownValue}
                onChange={(color: TrakColor) => setDropdownValue(color.hex)}
              />
              <h1 className="text-subtitle-lg text-medium">아카이브 만들기</h1>
            </div>

            {/* create form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-start gap-6">
              <div className="w-full flex flex-row items-stretch gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-[30%] lg:w-[420px] h-full flex flex-col items-start gap-5">
                  <ImageUploadInput
                    label="대표 이미지"
                    name="cover_image_url"
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
                    <FormButtons isLoading={isLoading} />
                  </div>
                </div>
              </div>
              <div className="block lg:hidden w-full">
                <FormButtons isLoading={isLoading} />
              </div>
              
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}