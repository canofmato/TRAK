'use client';

import React, { useRef, useState, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { LuUpload } from "react-icons/lu";
import { UseFormRegisterReturn } from "react-hook-form";

type ImageUploadInputProps = {
  label?: string;
  name: string;
  register?: UseFormRegisterReturn;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function ImageUploadInput({
  label,
  name,
  register,
  className,
  ...rest
}: ImageUploadInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 공통 레이아웃 스타일
  const baseAreaStyle = 'w-[420px] h-[470px] border border-dashed border-dark transition-all rounded-[10px] overflow-hidden';

  return (
    <div className={twMerge('flex flex-col gap-1 transition-all items-start', className)}>
      {label && (
        <label className="text-subtitle-md text-medium">
          {label}
        </label>
      )}

      {/* 보여지는 가짜 업로드 영역 */}
      <div className={twMerge("relative flex items-center justify-center", baseAreaStyle)}>
        
        {/* 1. 파일 선택 전 (와이어프레임 디자인) */}
        {!previewUrl && (
          <div className="flex flex-col items-center justify-center gap-2 text-center text-gray-300">
            {/* 업로드 아이콘 */}
            <LuUpload size={30} />
            
            <span className="text-body font-medium">대표 이미지 업로드</span>
            <span className="text-base font-medium">클릭하거나 드래그하여 업로드</span>
            
            {/* [중요] 사용자가 클릭할 진짜 버튼 */}
            <button 
              type="button"
              onClick={handleButtonClick}
              className="w-[120px] h-10 border border-dark rounded-[10px] text-base font-bold bg-white text-gray-300"
            >
              파일 선택
            </button>
          </div>
        )}

        {/* 2. 파일 선택 후 (미리보기 화면) */}
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
          ref={fileInputRef}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...register}
          {...rest}
        />
      </div>
    </div>
  );
}