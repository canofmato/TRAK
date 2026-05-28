'use client'

import { ColorPalette } from "@/components/common/ColorPalette/ColorPalette";
import { TabBar } from "@/components/layout/TabBar";
import { Header } from "@/components/layout/Header";
import { useState, useEffect } from "react";
import type { TrakColor } from "@/components/common/ColorPalette/ColorSwatch";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuPlus, LuX } from "react-icons/lu";
import type { PhotoFolder } from "@/types/database.types";
import { convertIfHeic } from "@/lib/convertHeic";

const MAX_PHOTOS = 30;

interface EditFolderFormValues {
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

interface ExistingPhoto {
  id: string;
  image_url: string;
  display_order: number;
}

const hasChanges = (
  snapshot: PhotoFolder,
  watched: EditFolderFormValues,
  colorId: string,
  existingPhotos: ExistingPhoto[],
  deletedPhotoIds: string[],
  newPhotos: File[]
): boolean => {
  return (
    snapshot.name !== watched.title ||
    snapshot.description !== (watched.description || null) ||
    snapshot.color !== (colorId || null) ||
    deletedPhotoIds.length > 0 ||
    newPhotos.length > 0
  )
}

function FormButtons({ isLoading, isChanged, onCancel }: { isLoading: boolean; isChanged: boolean; onCancel: () => void}) {
  return (
    <div className="flex w-full items-center justify-between gap-6 ">
      <Button type="button" variant="outlined" sizeVariant="sm" className="shrink-0" onClick={onCancel}>
        취소
      </Button>
      <Button type="submit" variant="filled" sizeVariant="md" disabled={!isChanged || isLoading} >
        {isLoading ? "생성 중..." : "폴더 수정하기"}
      </Button>
    </div>
  );
}


export default function EditFolderPage() {
  const router = useRouter();
  const params = useParams();
  const tripSlug = Array.isArray(params.tripSlug)
    ? params.tripSlug[0]
    : params.tripSlug ?? "";
  const folderName = Array.isArray(params.folderName)
    ? params.folderName[0]
    : params.folderName ?? "";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState(true);
  const [folderId, setFolderId] = useState<string>("");
  const [tripId, setTripId] = useState<string>("");

  const [colorValue, setColorValue] = useState<string>("")
  const [colorId, setColorId] = useState<string>("");

  // ✅ 기존 사진 (DB에서 로드)
  const [existingPhotos, setExistingPhotos] = useState<ExistingPhoto[]>([]);
  // ✅ 삭제 예약된 사진 ID 목록 (저장 시 일괄 삭제)
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<string[]>([]);
  // ✅ 새로 추가할 사진
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  // ✅ Deep Comparison용 스냅샷
  const [snapshot, setSnapshot] = useState<PhotoFolder | null>(null);


  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditFolderFormValues>({
    mode: "onChange"
  });

  const watchedValues = watch();

  const isChanged = snapshot
    ? hasChanges(snapshot, watchedValues, colorId, existingPhotos, deletedPhotoIds, newPhotos)
    : false;

  const totalPhotoCount = existingPhotos.length - deletedPhotoIds.length + newPhotos.length;

  // ✅ 마운트 시 기존 데이터 fetch
  useEffect(() => {
    if (!tripSlug || !folderName) return;

    const fetchData = async () => {
      try {
        // trip 가져오기
        const { data: tripData, error: tripError } = await supabase
          .from("trips")
          .select("id")
          .eq("slug", tripSlug)
          .single();

        if (tripError || !tripData) throw new Error("여행 정보를 찾을 수 없습니다.");
        setTripId(tripData.id);

        // 폴더 가져오기
        const { data: folderData, error: folderError } = await supabase
          .from("photo_folders")
          .select("*")
          .eq("trip_id", tripData.id)
          .eq("slug", folderName)
          .single();

        if (folderError || !folderData) throw new Error("폴더 정보를 찾을 수 없습니다.");

        setFolderId(folderData.id);
        setSnapshot(folderData);

        // ✅ form Pre-fill
        reset({
          title: folderData.name ?? "",
          description: folderData.description ?? "",
        });

        // FOLDER_COLORS에서 id 찾기
        const { FOLDER_COLORS } = await import("@/components/common/ColorPalette/ColorSwatch");
        const matchedColor = FOLDER_COLORS.find(
          (c) => c.id === folderData.color
        );
        setColorValue(matchedColor?.hex ?? "");
        setColorId(folderData.color ?? "");

        // 기존 사진 가져오기
        const { data: photoData, error: photoError } = await supabase
          .from("photos")
          .select("id, image_url, display_order")
          .eq("folder_id", folderData.id)
          .order("display_order", { ascending: true });

        if (!photoError && photoData) {
          setExistingPhotos(photoData);
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [tripSlug, folderName, reset]);

  // ✅ 기존 사진 삭제 예약
  const handleExistingPhotoDelete = (photoId: string) => {
    setDeletedPhotoIds((prev) => [...prev, photoId]);
    setExistingPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // ✅ 새 사진 추가
  const handleNewPhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const rawFiles = Array.from(e.target.files ?? []);
    const remaining = MAX_PHOTOS - totalPhotoCount;

    if (rawFiles.length > remaining) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있어요.`);
    }

    const rawAllowed = rawFiles.slice(0, remaining);

    // ✅ HEIC 변환
    const convertedFiles = await Promise.all(rawAllowed.map(convertIfHeic));
    const newPreviews = convertedFiles.map((f) => URL.createObjectURL(f));

    setNewPhotos((prev) => [...prev, ...convertedFiles]);
    setNewPhotoPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  // ✅ 새 사진 삭제
  const handleNewPhotoDelete = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<EditFolderFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push("/login");
        return;
      }

      // ✅ 제목 변경 시만 slug 재생성
      const titleChanged = snapshot?.name !== data.title;
      const newSlug = titleChanged ? generateSlug(data.title) : folderName;

      // ✅ photo_folders update
      const { error: updateError } = await supabase
        .from("photo_folders")
        .update({
          name: data.title,
          slug: newSlug,
          description: data.description || null,
          color: colorId || null,
        })
        .eq("id", folderId);

      if (updateError) throw updateError;

      // ✅ 삭제 예약된 사진 일괄 삭제
      if (deletedPhotoIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("photos")
          .delete()
          .in("id", deletedPhotoIds);

        if (deleteError) throw deleteError;
      }

      // ✅ 새 사진 순차 업로드
      const startOrder = existingPhotos.length - deletedPhotoIds.length + 1;
      for (let i = 0; i < newPhotos.length; i++) {
        const file = newPhotos[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${tripId}/${folderId}/${crypto.randomUUID()}-${i}.${fileExt}`;

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
            folder_id: folderId,
            user_id: user.id,
            image_url: publicUrl,
            display_order: startOrder + i,
          });

        if (photoInsertError) throw photoInsertError;
      }

      // ✅ slug 변경 시 새 경로로 리다이렉트
      router.push(`/trip/${tripSlug}/${newSlug}`);

    } catch (error) {
      console.error("폴더 수정 실패:", error);
      alert("폴더 수정에 실패했습니다.");
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
            <div className="flex items-center">
              <h1 className="text-subtitle-lg text-medium">폴더 수정하기</h1>
            </div>

            {/* create form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-start gap-6">
              <div className="w-full flex flex-row items-stretch gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-[30%] lg:w-[420px] h-full flex flex-col items-start gap-5">
                  <div className="w-full flex flex-col gap-2">

                    <span className="text-subtitle-md text-medium">
                      선택된 사진 ({totalPhotoCount}/{MAX_PHOTOS})
                    </span>

                    <div className="w-full h-[400px] overflow-y-auto">
                      <div className="w-full grid grid-cols-3 gap-2">
                        {existingPhotos.map((photo) => (
                          <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden group">
                            <img
                              src={photo.image_url}
                              alt={`기존 사진`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleExistingPhotoDelete(photo.id)}
                              className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full
                                        text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <LuX size={12} />
                            </button>
                          </div>
                        ))}

                        {/* ✅ 새로 추가된 사진 */}
                        {newPhotoPreviews.map((src, i) => (
                          <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden group">
                            <img
                              src={src}
                              alt={`새 사진 ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleNewPhotoDelete(i)}
                              className="absolute top-1 right-1 p-0.5 bg-black/50 rounded-full
                                         text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <LuX size={12} />
                            </button>
                          </div>
                        ))}

                        {totalPhotoCount < MAX_PHOTOS && (
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
                              onChange={handleNewPhotosChange}
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
                      isChanged={isChanged}
                      onCancel={() => router.push(`/trip/${tripSlug}/${folderName}`)}
                    />
                  </div>
                </div>
              </div>
              <div className="block lg:hidden w-full">
                <FormButtons
                  isLoading={isLoading}
                  isChanged={isChanged}
                  onCancel={() => router.push(`/trip/${tripSlug}/${folderName}`)}
                />
              </div>
              
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}