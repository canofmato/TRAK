'use client'

import { useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { LuPencil } from "react-icons/lu"
import { convertIfHeic } from "@/lib/convertHeic"

interface AvatarUploadProps {
  initialUrl?: string
  onUploadSuccess: (url: string) => void
}

export default function AvatarUpload({ initialUrl, onUploadSuccess }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.files?.[0]
    if (!raw) return

    // ✅ HEIC 변환
    const file = await convertIfHeic(raw)

    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)

    // 업로드
    setIsUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("로그인이 필요해요.")

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName)

      onUploadSuccess(publicUrl)
    } catch (error) {
      console.error("아바타 업로드 실패:", error)
      setPreviewUrl(initialUrl ?? null)
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  return (
    <div className="relative w-[200px] h-[200px] shrink-0">
      {/* 원형 아바타 */}
      <div className="w-full h-full rounded-full border border-light overflow-hidden bg-gray-200">
        {previewUrl ? (
          <img src={previewUrl} alt="프로필 이미지" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        {/* 업로드 중 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
            <span className="text-white text-xs animate-pulse">업로드 중</span>
          </div>
        )}
      </div>

      {/* ✅ 연필 아이콘 — 우하단 */}
      <label className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-gray-200
                        flex items-center justify-center cursor-pointer
                        hover:bg-gray-50 transition-colors shadow-sm">
        <LuPencil size={14} className="text-gray-400" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  )
}