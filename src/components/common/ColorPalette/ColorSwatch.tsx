export interface TrakColor {
  id: string;
  label: string;
  bgClass: string;
  hex: string;
};

export const TRAK_COLORS: TrakColor[] = [
  {id: "sky", label:"sky", bgClass:"bg-primary", hex: "#D7E8F8"},
  {id: "rose", label:"rose", bgClass:"bg-rose", hex: "#FADAE5"},
  {id: "amber", label:"amber", bgClass:"bg-amber", hex: "#FFF1CE"},
  {id: "lime", label:"lime", bgClass:"bg-lime", hex: "#D4EBDB"},
];

export const FOLDER_COLORS: TrakColor[] = [
  ...TRAK_COLORS,
  {id: "gray", label:"gray", bgClass:"bg-[#7B7B7B]", hex: "#7B7B7B"},
];

interface ColorSwatchProps {
  color: TrakColor;
  selected?: boolean;
  onClick?: (color: TrakColor) => void;
};

export function ColorSwatch({ color, selected = false, onClick}: ColorSwatchProps) {
  return(
    <button
      type="button"
      aria-label={`${color.label} 선택${selected ? " (선택됨)" : ""}`}
      aria-pressed={selected}
      className={`
        w-[50px] h-[50px] rounded-full ${color.bgClass}
        border-2 transition-all duration-150
        ${selected
          ? "border-dark scale-110"
          : "border-transparent hover:scale-105"
        }
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-gray-200 cursor-pointer
        `}
      onClick={() => onClick?.(color)}
    />
  )
}