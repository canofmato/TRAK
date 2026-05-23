import { twMerge } from "tailwind-merge";

interface HashtagProps {
  text: string;
  onClick?: (text: string) => void;
  onDelete?: (text: string) => void;
  className?: string;
};

export function Hashtag({ text, onClick, onDelete, className }: HashtagProps) {
  const formattedText = text.startsWith("#") ? text: `#${text}`;
  return (
    <button
      type="button"
      aria-label={`${text} 태그 클릭하여 삭제`}
      className={twMerge(
       "inline-flex items-center p-3 rounded-full bg-primary/30 text-black text-body transition-all duration-150 cursor-pointer hover:bg-red/30 hover:shadow-sm active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-200" ,
        className)}
      onClick={() => onDelete?.(text)}
    >
      <span>{formattedText}</span>
    </button>
  )
}