'use client'
import { ColorPalette } from "@/components/common/ColorPalette/ColorPalette";
import { TabBar } from "@/components/layout/TabBar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import type { TrakColor } from "@/components/common/ColorPalette/ColorSwatch";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuPlus, LuX } from "react-icons/lu";

const MAX_PHOTOS = 30;

interface CreateFolderFormValues {
  title: string;
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

  // 순수 한글 제목이면 base가 빈 문자열 → folder로 fallback
  const safeBase = base || "folder"

  return `${safeBase}-${Date.now().toString().slice(-5)}`
};


function FormButtons({ isLoading, onCancel }: { isLoading: boolean; onCancel: () => void}) {
  return (
    <div className="flex w-full items-center justify-between gap-6 ">
      <Button type="button" variant="outlined" sizeVariant="sm" className="shrink-0" onClick={onCancel}>
        취소
      </Button>
      <Button type="submit" variant="filled" sizeVariant="md">
        {isLoading ? "생성 중..." : "아카이브 만들기"}
      </Button>
    </div>
  );
}


export default function CreateFolderPage() {
  const router = useRouter();
  const params = useParams();
  const tripSlug = Array.isArray(params.tripSlug)
    ? params.tripSlug[0]
    : params.tripSlug ?? "";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorValue, setColorValue] = useState<string>("")
  const [colorId, setColorId] = useState<string>("");

  // ✅ 다중 사진 상태 관리
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFolderFormValues>({
    mode: "onChange"
  });

  // ✅ 다중 사진 선택 핸들러 (최대 30장)
  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_PHOTOS - photos.length;

    if (files.length > remaining) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있어요. (${photos.length}장 이미 선택됨)`);
    }

    const allowed = files.slice(0, remaining);
    const newPreviews = allowed.map((f) => URL.createObjectURL(f));

    setPhotos((prev) => [...prev, ...allowed]);
    setPhotoPreviews((prev) => [...prev, ...newPreviews]);

    // input 초기화 (같은 파일 재선택 가능하도록)
    e.target.value = "";
  };

  // ✅ 개별 사진 삭제
  const handlePhotoDelete = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<CreateFolderFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert("로그인 세션이 만료되었습니다.");
        router.push("/login");
        return;
      }

      // ✅ tripSlug로 trip_id 가져오기
      const { data: tripData, error: tripError } = await supabase
        .from("trips")
        .select("id")
        .eq("slug", tripSlug)
        .single();

      if (tripError || !tripData) throw new Error("여행 정보를 찾을 수 없습니다.");

      // ✅ folderName(slug) 생성
      const folderSlug = generateSlug(data.title);

      // ✅ photo_folders 테이블에 insert
      const { data: folderData, error: folderError } = await supabase
        .from("photo_folders")
        .insert({
          trip_id: tripData.id,
          user_id: user.id,
          name: data.title,
          slug: folderSlug,
          description: data.description || null,
          color: colorId || "gray",
        })
        .select()
        .single();

      if (folderError || !folderData) throw folderError;

      // ✅ 사진 비동기 순차 업로드 (Storage → photos 테이블)
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${tripData.id}/${folderData.id}/${crypto.randomUUID()}-${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("photos")
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("photos")
          .getPublicUrl(fileName);

        const { error: photoInsertError } = await supabase
          .from("photos")
          .insert({
            folder_id: folderData.id,
            user_id: user.id,
            image_url: publicUrl,
            display_order: i + 1,
          });

        if (photoInsertError) throw photoInsertError;
      }

      // ✅ 폴더 상세 페이지로 이동
      router.push(`/trip/${tripSlug}/${folderSlug}`);

    } catch (error) {
      if (error instanceof Error) {
        alert(`폴더 생성 실패 ❌\n사유: ${error.message}`);
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
            <div className="flex items-start">
              <h1 className="text-subtitle-lg text-medium">폴더 만들기</h1>
            </div>

            {/* create form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-start gap-6">
              <div className="w-full flex flex-row items-stretch gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-[30%] lg:w-[420px] h-full flex flex-col items-start gap-5">
                  <div className="w-full flex flex-col gap-2">

                    <span className="text-subtitle-md text-medium">
                      선택된 사진 ({photos.length}/{MAX_PHOTOS})
                    </span>

                    <div className="w-full h-[400px] overflow-y-auto">
                      <div className="w-full grid grid-cols-3 gap-2">
                        {photoPreviews.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                            <img
                              src={src}
                              alt={`선택된 사진 ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handlePhotoDelete(i)}
                              className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full
                                        text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <LuX size={12} />
                            </button>
                          </div>
                        ))}

                        {photos.length < MAX_PHOTOS && (
                          <label className="w-[140px] h-[140px] rounded-lg border-2 border-dashed border-light
                                            flex flex-col items-center justify-center gsp-1 cursor-pointer
                                            hover:border-darker transition-colors">
                            <LuPlus size={24} className="text-gray-300" />
                            <span className="text-base text-gray-300">사진 추가</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handlePhotosChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-3 items-stretch">
                  <div className="flex flex-col lg:flex-row w-full gap-3">
                    <Input
                      name="title"
                      label="제목"
                      placeholder="예: SELFIE"
                      variant="outlined"
                      sizeVariant="sm"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                      register={register("title", { required: "폴더 제목은 필수 항목입니다.(영어 추천)" })}
                      errors={errors}
                    />
                    <div className="flex flex-col items-start justify-center">
                      <label className="font-roboto text-base text-start">색상</label>
                      <ColorPalette
                        mode="static"
                        value={colorValue}  // ✅ hex로 넘겨야 선택 border 작동
                        onChange={(color: TrakColor) => {
                          setColorValue(color.hex)  // ColorPalette 표시용
                          setColorId(color.id)      // DB 저장용
                        }}
                      />
                    </div>
                  </div>
                  <Textarea
                    name="description"
                    label="설명"
                    placeholder="여행에 대한 설명을 입력하세요."
                    sizeVariant="md"
                    register={register("description")}
                  />
                  <div className="hidden lg:block w-full">
                    <FormButtons 
                      isLoading={isLoading}
                      onCancel={() => router.push(`/trip/${tripSlug}`)}
                    />
                  </div>
                </div>
              </div>
              <div className="block lg:hidden w-full">
                <FormButtons
                  isLoading={isLoading}
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