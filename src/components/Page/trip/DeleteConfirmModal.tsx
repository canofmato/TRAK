'use client'

import Button from "@/components/common/Button";

interface DeleteConfimModalProps {
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfimModalProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      {/* 모달 */}
      <div
        className="rounded-[10px] px-3 py-5 bg-white flex flex-col items-center justify-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-subtitle-md text-black">여행을 삭제하시겠습니까?</p>
          <p className="text-body text-gray-300">삭제된 여행은 다시 되돌릴 수 없습니다.</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={onCancel}
            className="w-[150px]"
          >
            취소
          </Button>
          <Button
            variant="delete"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-[150px]"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </div>
      </div>
    </div>
  )
}