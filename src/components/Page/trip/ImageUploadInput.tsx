'use client';

import React, { useRef, useState, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { LuUpload } from "react-icons/lu";
import { UseFormRegisterReturn } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { convertIfHeic } from "@/lib/convertHeic";
import Toast from "@/components/common/Toast";

type ImageUploadInputProps = {
  label?: string;
  name: string;
  register?: UseFormRegisterReturn;
  className?: string;
  initialUrl?: string;
  onUploadSuccess?: (url: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export default function ImageUploadInput({
  label,
  name,
  register,
  className,
  initialUrl,
  onUploadSuccess,
  ...rest
}: ImageUploadInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  // 🔥 [핵심] Supabase Storage 실제 파일 업로드 처리 함수
  const uploadImageToStorage = async (file: File) => {
    setIsUploading(true);
    try {
      // 1. 현재 로그인 유저 정보 추출 (경로 규칙 바인딩용)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("로그인 세션이 만료되었습니다.");
      }

      // 2. 경로 가이드라인 준수: {userId}/{timestamp}.{ext}
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // 3.  'trip-covers' public 버킷에 파일 전송 🚀
      const { data, error: uploadError } = await supabase.storage
        .from("trip-covers") // 💡 trips 대신 실제 존재하는 'trip-covers'로 매칭!
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. 업로드된 파일의 영구 Public URL 획득
      const { data: { publicUrl } } = supabase.storage
        .from("trip-covers")
        .getPublicUrl(fileName);

      // 5. 부모 컴포넌트(page.tsx)의 coverImageUrl 상태로 주소 전달 🎉
      if (onUploadSuccess) {
        onUploadSuccess(publicUrl);
      }

    } catch (error) {
      if (error instanceof Error) {
        setToastMessage(`이미지 업로드 실패... ${error.message}`);
      } else {
        setToastMessage("이미지 업로드 중 알 수 없는 에러가 발생했습니다.");
      }
      setPreviewUrl(null); // 실패 시 미리보기 클리어
    } finally {
      setIsUploading(false);
    }
  };

  // 💡 파일 선택 시 발동하는 핸들러
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.files?.[0];
    if (!raw) return;

    // ✅ HEIC 변환
    const file = await convertIfHeic(raw);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    uploadImageToStorage(file);

    if (register?.onChange) register.onChange(e);
  };

  // 💡 Delete 버튼 클릭 핸들러 (원래 UI 버튼 기능 연동 및 부모 리셋)
  const handlePreviewDelete = () => {
    if (isUploading) return;
    setPreviewUrl(null);
    if (onUploadSuccess) {
      onUploadSuccess("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const baseAreaStyle = 'w-full  min-h-[360px] lg:h-[470px] lg:max-h-[470px]  border border-dashed border-dark transition-all rounded-[10px] overflow-hidden';

  const { ref: registerRef, onChange: registerOnChange, ...restRegister } = register || {};

  return (
    <div className={twMerge('flex flex-col gap-2 transition-all items-start w-full', className)}>
      {toastMessage && (
        <div className="fixed left-1/2 top-8 z-50 -translate-x-1/2">
          <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast>
        </div>
      )}
      <div className="flex items-end justify-between w-full">
        {label && (
          <label htmlFor={name} className="text-subtitle-md text-medium">
            {label}
          </label>
        )}
        {previewUrl && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isUploading}
              className="text-base text-gray-200 hover:text-gray-400 underline transition-all"
            >
              ReUpload
            </button>
            <button
              type="button"
              onClick={handlePreviewDelete}
              disabled={isUploading}
              className="text-base text-gray-200 hover:text-gray-400 underline transition-all"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      


      <div className={twMerge("relative flex items-center justify-center", baseAreaStyle)}>
        
        {!previewUrl && (
          <div className="flex flex-col items-center justify-center gap-2 text-center text-gray-300">

            <LuUpload size={30} />
            
            <span className="text-body font-medium">대표 이미지 업로드</span>
            <span className="text-base font-medium">클릭하거나 드래그하여 업로드</span>

            <button 
              type="button"
              onClick={handleButtonClick}
              className="w-[120px] h-10 border border-dark rounded-[10px] text-base font-bold bg-white text-gray-300"
            >
              파일 선택
            </button>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="text-white text-body font-medium animate-pulse">이미지 업로드 중... ⏳</span>
          </div>
        )}

        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="대표 이미지 미리보기" 
            className="w-full h-full object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          id={name}
          name={name}
          ref={(e) => {
            fileInputRef.current = e;
            if (registerRef) registerRef(e);
          }}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
          {...restRegister}
          {...rest}
        />
      </div>
    </div>
  );
}
