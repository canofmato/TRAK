import { TextareaHTMLAttributes } from "react";
import clsx from 'clsx';
import { twMerge } from "tailwind-merge";
import { CommonProps } from "@/types/inputTypes";

const SIZES =  {
  lg: "w-[750px] h-[250px] p-5 border border-light",
  md: "w-[700px] h-[215px] p-5 border border-light",
} as const;

type TextareaProps = Omit<CommonProps, 'errors' | 'touchFields'> & {
  sizeVariant?: keyof typeof SIZES;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof CommonProps>;

export default function Textarea({
  sizeVariant = 'lg',
  label,
  className,
  id,
  placeholder,
  name,
  register,
  ...rest
}: TextareaProps) {
  const baseStyle = clsx(
    'rounded-[10px] transition-all',
    `bg-white text-base`,
    'text-gray-400 placeholder:text-gray-200',
    'border border-light border-transparent focus:border-dark focus:outline-none',
    SIZES[sizeVariant]
  );

  return (
    <div className={twMerge('flex flex-col gap-2 transition-all', className)}>
      {label && (
        <label htmlFor={id ?? name} className="font-roboto text-caption text-start">
          {label}
        </label>
      )}
      <textarea
        id={id ?? name}
        placeholder={placeholder}
        className={twMerge(baseStyle)}
        {...register}
        {...rest}
      />
    </div>
  );
}