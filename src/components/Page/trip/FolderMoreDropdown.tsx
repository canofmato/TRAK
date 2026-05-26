'use client'

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import More from "@/assets/icons/More-black.svg";
import Button from "@/components/common/Button"
import DeleteConfirmModal from "@/components/Page/trip/DeleteConfirmModal";

interface MoreDropdownProps {
  folderId: string;
  tripSlug: string;
  folderSlug: string;
}

export default function FolderMoreDropdown({ folderId, tripSlug, folderSlug }: MoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 외부 클릭시 드롭다운 닫기
  useEffect(()=> {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleEdit = () => {
    router.push(`/trip/${tripSlug}/${folderSlug}/edit`)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('photo_folders')
        .delete()
        .eq('id', folderId)
      if (error) throw error

      router.push( `/trip/${tripSlug}`)
    } catch {
      setIsDeleting(false);
      setIsModalOpen(false);
    }
  }
  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="더보기 메뉴"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="p-1 hover:opacity-70 transition-opacity"
        >
          <More size={40} />
        </button>

        {/* 드롭다운 */}
        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 top-10 z-50 flex gap-2 py-3"
          >
            <Button
              variant="outlined"
              sizeVariant="ss"
              onClick={handleEdit}
            >
              수정
            </Button>
            <Button
              variant="delete"
              sizeVariant="ss"
              onClick={() => {
                setIsOpen(false)
                setIsModalOpen(true)
              }}
            >
              삭제
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <DeleteConfirmModal
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsModalOpen(false)}
          message={{
            title: '폴더를 삭제하시겠습니까?',
            description: '삭제된 폴더는 다시 되돌릴 수 없습니다.',
          }}
        />
      )}
    </>
  )
}