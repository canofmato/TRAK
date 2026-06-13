'use client'

import Button from "@/components/common/Button";

type ConfirmVariant = "primary" | "filled" | "outlined" | "delete";

interface ConfirmModalProps {
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  loadingLabel?: string;
  confirmVariant?: ConfirmVariant;
}

export default function ConfirmModal({
  isLoading = false,
  onConfirm,
  onCancel,
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  loadingLabel,
  confirmVariant = "filled",
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="rounded-[10px] px-3 py-5 bg-white flex flex-col items-center justify-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <p className="text-subtitle-md text-black">{title}</p>
          <p className="text-body text-gray-300">{description}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={onCancel}
            className="w-[150px]"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="w-[150px]"
          >
            {isLoading ? loadingLabel ?? `${confirmLabel} 중...` : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
