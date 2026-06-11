import { HTMLAttributes, ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type ToastProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  showClose?: boolean;
};

export default function Toast({
  children,
  onClose,
  closeLabel = "토스트 닫기",
  showClose = true,
  className,
  ...rest
}: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={twMerge(
        clsx(
          "relative flex min-h-[56px] w-[min(420px,calc(100vw-32px))] items-center justify-center",
          "rounded-[10px] bg-primary px-14 py-[14px]",
          "text-center text-body font-regular text-black",
        ),
        className,
      )}
      {...rest}
    >
      <p className="min-w-0 break-words font-noto font-bold eading-normal">{children}</p>

      {showClose && (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="absolute right-5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center text-[#D9D9D9] transition-colors hover:text-gray-200"
        >
          <X size={26} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
