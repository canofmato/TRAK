'use client';

import { useState, KeyboardEvent } from "react";
import { Hashtag } from "@/components/common/Hashtag";

type HashtagInputProps = {
  label?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
};

export default function HashtagInput({
  label,
  value,
  onChange,
  placeholder = "예: HONGKONG",
  className,
}: HashtagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const trimmed = inputValue.trim().toUpperCase().replace(/^#/, "");
    if (!trimmed || value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInputValue("");
  };

  const handleDelete = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className={className}>
      {label && (
        <label className="font-roboto text-base text-start block mb-2">
          {label}
        </label>
      )}

      {/* ✅ 태그들 + 인풋이 가로로 나열되는 wrapper */}
      <div className="w-full flex flex-nowrap items-center gap-2 overflow-x-auto">

        {/* ✅ 태그들 — 인풋 바깥, 독립 요소 */}
        {value.map((tag) => (
          <Hashtag
            key={tag}
            text={tag}
            onDelete={handleDelete}
          />
        ))}

        {/* ✅ 인풋 — 자기만의 border 박스 */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : "예: HONGKONG"}
          className="w-full shrink-0 min-w-[300px] h-[50px] px-4 rounded-[10px] border border-light bg-white outline-none text-base text-gray-400 placeholder:text-gray-200"
        />
      </div>
    </div>
  );
}