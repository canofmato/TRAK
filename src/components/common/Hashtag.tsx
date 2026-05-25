import { twMerge } from "tailwind-merge";

interface HashtagProps {
  text: string;
  onClick?: (text: string) => void;
  onDelete?: (text: string) => void;
};

export function Hashtag({ text, onClick, onDelete}: HashtagProps) {
  const formattedText = text.startsWith("#") ? text: `#${text}`;

  const isDeletable = !!onDelete;

  return (
    <button
      type="button"
      aria-label={`${text} 태그 ${isDeletable ? '클릭하여 삭제' : ''}`}
      className={twMerge(
       "shrink-0 inline-flex items-center rounded-full bg-primary/30 text-black transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200",
       isDeletable
        ? "p-3 text-body cursor-pointer hover:bg-red/30 hover:shadow-sm active:scale-95 "
        : "p-1 text-base cursor-default",
      )}
        onClick={() => {
          if (onDelete) onDelete(text);
          else if (onClick) onClick(text);
        }}
        disabled={!isDeletable && !onClick}
    >
      <span>{formattedText}</span>
    </button>
  )
}