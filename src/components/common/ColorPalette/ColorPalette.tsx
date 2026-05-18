"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { ColorSwatch, TRAK_COLORS, type TrakColor } from "./ColorSwatch";

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

function isLightColor(hex:string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

function createCustomColor(hex: string, index: number): TrakColor {
  return {
    id: `custon-${index}-${hex.slice(1)}`,
    label: "Custon",
    bgClass: `bg-[${hex}]`,
    hex,
  };
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface BaseProps {
  value?: string;
  onChange?: (color: TrakColor) => void;
  allowCustom?: boolean;
  customColors?: TrakColor[];
  onCustomColorsChange?: (color: TrakColor[]) => void;
}

interface StaticProps extends BaseProps {
  mode: "static";
}

interface DropdownProps extends BaseProps {
  mode: "dropdown";
}

type ColorPaletteProps = StaticProps | DropdownProps;

// ─── 메인 컴포넌트  ─────────────────────────────────────────────────────────────────────

export function ColorPalette(props: ColorPaletteProps) {
  const {
    value,
    onChange,
    allowCustom = true,
    customColors: externalCustomColors,
    onCustomColorsChange,
  } = props;

  const [internalCustomColors, setInternalCustomColors] = useState<TrakColor[]>([]);
  const customColors = externalCustomColors ?? internalCustomColors;

  const handleCustomColorsChange = useCallback(
    (colors: TrakColor[]) => {
      if (onCustomColorsChange) {
        onCustomColorsChange(colors);
      } else {
        setInternalCustomColors(colors);
      }
    },
    [onCustomColorsChange]
  );

  const allColors = [...TRAK_COLORS, ...customColors];
  const selectedColor = allColors.find((c) => c.hex === value) ?? null;

  const handleAddCustomColor = useCallback(
    (hex: string) => {
      if (allColors.some((c) => c.hex.toLowerCase() === hex.toLowerCase())) return;
      const newColor = createCustomColor(hex, customColors.length);
      handleCustomColorsChange([...customColors, newColor]);
      onChange?.(newColor);
    },
    [allColors, customColors, handleCustomColorsChange, onChange]
  );

  if (props.mode === "static") {
    return (
      <StaticPalette
        colors={allColors}
        selectedColor={selectedColor}
        allowCustom={allowCustom}
        onChange={onChange}
        onAddCustomColor={handleAddCustomColor}
      />
    );
  }

  return (
    <DropdownPalette
      colors={allColors}
      selectedColor={selectedColor}
      allowCustom={allowCustom}
      onChange={onChange}
      onAddCustomColor={handleAddCustomColor}
    />
  );
}

// ─── 커스텀 색상 Swatch ─────────────────────────────────────────────────────────────────────
// Tailwind JIT는 런타임 동적 hex(bg-[${hex}])를 생성할 수 없으므로
// 커스텀 색상만 inline style 사용


interface SwatchProps {
  color: TrakColor;
  selected: boolean;
  onClick?: (color: TrakColor) => void;
};

function Swatch({ color, selected, onClick }: SwatchProps) {
  if (!color.id.startsWith("custom-")) {
    return <ColorSwatch color={color} selected={selected} onClick={onClick} />;
  }

  const borderColor = selected ? "#6B6B6B" : isLightColor(color.hex) ? "#B0B0B0" : "#8A8A8A";

  return (
    <button
      type="button"
      aria-label={`커스텀 색상 선택${selected ? " (선택됨)" : ""}`}
      aria-pressed={selected}
      style={{ backgroundColor: color.hex, borderColor, borderWidth: 2, borderStyle: "solid" }}
      className={`
        size-12 rounded-full transition-all duration-150
        ${selected ? "scale-110 shadow-md" : "hover:scale-105"}
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-gray-200 cursor-pointer
      `}
      onClick={() => onClick?.(color)}
    />
  );
};

// ─── + 버튼 ───────────────────────────────────────────────────────────────────

function AddColorButton({ onAdd }: { onAdd: (hex: string) => void }) {
  return (
    <div className="relative">
      <input
        type="color"
        aria-label="커스텀 색상 추가"
        defaultValue="#ffffff"
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onAdd(e.target.value)}
      />
      <div
        aria-hidden="true"
        className="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center pointer-events-none"
      >
        <span className="text-white text-40 leading-none">+</span>
      </div>
    </div>
  );
};

// ─── Static ───────────────────────────────────────────────────────────────────

interface StaticPaletteProps {
  colors: TrakColor[];
  selectedColor: TrakColor | null;
  allowCustom: boolean;
  onChange?: (color: TrakColor) => void;
  onAddCustomColor: (hex: string) => void;
}

function StaticPalette({
  colors,
  selectedColor,
  allowCustom,
  onChange,
  onAddCustomColor,
}: StaticPaletteProps) {
  return (
    <div role="group" aria-label="색상 팔레트" className="flex items-center gap-3">
      {colors.map((color) => (
        <Swatch
          key={color.id}
          color={color}
          selected={selectedColor?.id === color.id}
          onClick={onChange}
        />
      ))}
      {allowCustom && <AddColorButton onAdd={onAddCustomColor} />}
    </div>
  );
};

// ─── Dropdown ───────────────────────────────────────────────────────────────────

interface DropdownPaletteProps {
  colors: TrakColor[];
  selectedColor: TrakColor | null;
  allowCustom: boolean;
  onChange?: (color: TrakColor) => void;
  onAddCustomColor: (hex: string) => void;
}

function DropdownPalette({
  colors,
  selectedColor,
  allowCustom,
  onChange,
  onAddCustomColor,
}: DropdownPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSelect = useCallback(
    (color: TrakColor) => {
      onChange?.(color);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleAddCustom = useCallback(
    (hex: string) => {
      onAddCustomColor(hex);
      setIsOpen(false);
    },
    [onAddCustomColor]
  );

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* 트리거 */}
      {selectedColor ? (
        <Swatch
          color={selectedColor}
          selected={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        />
      ) : (
        <button
          type="button"
          aria-label="색상 팔레트 열기"
          aria-expanded={isOpen}
          className="w-[50px] h-[50px] rounded-full bg-gray-300 flex items-center justify-center
            transition-transform duration-150 hover:scale-105 active:scale-95
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-gray-300 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span aria-hidden="true" className="text-white text-40 leading-none">+</span>
        </button>
      )}

      {/* 팔레트 패널 */}
      <div
        role="listbox"
        aria-label="색상"
        aria-hidden={!isOpen}
        className={`
          absolute
          flex flex-row gap-2 items-center
          bg-white/90 backdrop-blur-sm rounded-full px-3 py-2
          shadow-lg border border-gray-100
          transition-all duration-200
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}
        `}
      >
        {colors.map((color) => (
          <Swatch
            key={color.id}
            color={color}
            selected={selectedColor?.id === color.id}
            onClick={handleSelect}
          />
        ))}
        {allowCustom && <AddColorButton onAdd={handleAddCustom} />}
      </div>
    </div>
  );
}
