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

function createCustomColor(hex: string): TrakColor {
  return {
    id: `custom-${hex.slice(1)}`,
    label: "Custom",
    bgClass: "",
    hex,
  };
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface BaseProps {
  value?: string;
  onChange?: (color: TrakColor) => void;
  allowCustom?: boolean;
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
  } = props;
  // 기본 제공 색상 중에 현재 value가 있는지 확인
  const defaultColor = TRAK_COLORS.find((c) => c.hex.toLowerCase() === value?.toLowerCase());
  // 없는데 value가 존재한다면 사용자가 지정한 커스텀 색상으로 간주
  const selectedColor = defaultColor ?? (value ? createCustomColor(value) : null);

  const handleCustomColorChange = useCallback(
    (hex: string) => {
      const newColor = createCustomColor(hex);
      onChange?.(newColor);
    },
    [onChange]
  );

  if (props.mode === "static") {
    return (
      <StaticPalette
        selectedColor={selectedColor}
        allowCustom={allowCustom}
        onChange={onChange}
        onCustomColorChange={handleCustomColorChange}
      />
    );
  }

  return (
    <DropdownPalette
      selectedColor={selectedColor}
      allowCustom={allowCustom}
      onChange={onChange}
      onCustomColorChange={handleCustomColorChange}
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

  return (
    <button
      type="button"
      aria-label={`커스텀 색상 선택${selected ? " (선택됨)" : ""}`}
      aria-pressed={selected}
      style={{ backgroundColor: color.hex }}
      className={`
        w-[50px] h-[50px] rounded-full transition-all duration-150
        ${selected ? "scale-110 shadow-md" : "hover:scale-105"}
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-gray-200 cursor-pointer
      `}
      onClick={() => onClick?.(color)}
    />
  );
};

// ─── + 버튼 ───────────────────────────────────────────────────────────────────

interface AddColorButtonProps {
  customHex: string | null;
  isSelected: boolean;
  onColorChange: (hex: string) => void;
}

function AddColorButton({ customHex, isSelected, onColorChange }: AddColorButtonProps) {
  const currentHex = customHex ?? "#7B7B7B";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  const borderColor = isSelected ? "#7B7B7B" : isLightColor(currentHex) ? "#919191" : "#7B7B7B";
  const textColor = isLightColor(currentHex) ? "text-gray-400" : "text-white";

  return (
    <div className="relative">
      <input
        type="color"
        aria-label="커스텀 색상 추가"
        value={currentHex}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full"
        onChange={handleChange}
      />
      <div
        aria-hidden="true"
        style={{ backgroundColor: currentHex, borderColor }}
        className="w-[50px] h-[50px] rounded-full flex items-center justify-center pointer-events-none transition-colors duration-150 border-2"
      >
        <span className="text-white text-heading-lg leading-none">+</span>
      </div>
    </div>
  );
};

// ─── Static ───────────────────────────────────────────────────────────────────

interface StaticPaletteProps {
  selectedColor: TrakColor | null;
  allowCustom: boolean;
  onChange?: (color: TrakColor) => void;
  onCustomColorChange: (hex: string) => void;
}

function StaticPalette({
  selectedColor,
  allowCustom,
  onChange,
  onCustomColorChange,
}: StaticPaletteProps) {
  const isCustomSelected = !!(selectedColor && selectedColor.id.startsWith("custom-"));

  return (
    <div role="group" aria-label="색상 팔레트" className="flex items-center gap-3">
      {TRAK_COLORS.map((color) => (
        <Swatch
          key={color.id}
          color={color}
          selected={selectedColor?.id === color.id}
          onClick={onChange}
        />
      ))}
      {allowCustom && (
        <AddColorButton 
          customHex={isCustomSelected ? selectedColor!.hex : null}
          isSelected={isCustomSelected}
          onColorChange={onCustomColorChange}
        />
      )}
    </div>
  );
};

// ─── Dropdown ───────────────────────────────────────────────────────────────────

interface DropdownPaletteProps {
  selectedColor: TrakColor | null;
  allowCustom: boolean;
  onChange?: (color: TrakColor) => void;
  onCustomColorChange: (hex: string) => void;
}

function DropdownPalette({
  selectedColor,
  allowCustom,
  onChange,
  onCustomColorChange,
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

  const handleCustomSelect = useCallback(
    (hex: string) => {
      onCustomColorChange(hex);
      setIsOpen(false);
    },
    [onCustomColorChange]
  );
  const isCustomSelected = !!(selectedColor && selectedColor.id.startsWith("custom-"));

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
          className="w-[50px] h-[50px] bg-gray-300 rounded-full flex items-center justify-center
            transition-transform duration-150 hover:scale-105 active:scale-95
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-gray-300 cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span aria-hidden="true" className="text-white text-heading-lg leading-none">+</span>
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
        {TRAK_COLORS.map((color) => (
          <Swatch
            key={color.id}
            color={color}
            selected={selectedColor?.id === color.id}
            onClick={handleSelect}
          />
        ))}
        {allowCustom && (
          <AddColorButton
            customHex={isCustomSelected ? selectedColor!.hex : null}
            isSelected={isCustomSelected}
            onColorChange={handleCustomSelect}
          />
        )}
      </div>
    </div>
  );
}
