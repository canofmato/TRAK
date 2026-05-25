'use client'

import { supabase } from "@/lib/supabaseClient";
import { useTabStore } from "@/store/tabStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import More from "@/assets/icons/More.svg";
import Button from "../common/Button";
import DeleteConfirmModal from "./trip/DeleteConfirmModal";

interface MoreDropdownProps {
  tripId: string;
  tripSlug: string;
}

export default function MoreDropdown({ tripId, tripSlug }: MoreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const removeTab = useTabStore((state) => state.removeTab);

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
    router.push(`/trip/[tripSlug]/edit`)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId)
      if (error) throw error

      removeTab(tripSlug);

      router.push( `/main`)
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
        />
      )}
    </>
  )
}