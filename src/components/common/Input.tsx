import React, { InputHTMLAttributes } from "react";
import clsx from 'clsx';
import { twMerge } from "tailwind-merge";
import { LuEye as IconEyeOpen, LuEyeClosed as IconEyeClosed } from "react-icons/lu";
import { CommonProps } from "@/types/inputTypes";

const VARIANTS = {
  filled: "bg-gray-200/20 text-base focus:bg-gray-100/50 border focus:border-light",
  outlined: "bg-white text-base",
} as const;

const SIZES =  {
  lg: "w-[500px] h-[50px]",
  md: "w-[360px] h-[50px]",
  sm: "w-[300px] h-[50px]",
  hashtag: "w-[420px] h-[50px]",
} as const;

// isTextArea 값에 따라 허용 속성을 다르게 분류
type InputProps =  CommonProps & {
  variant?: keyof typeof VARIANTS;
  sizeVariant?: keyof typeof SIZES;
} & Omit<InputHTMLAttributes<HTMLInputElement>, keyof CommonProps>;

export default function Input({
  variant = 'outlined',
  sizeVariant ='md',
  label,
  className,
  id,
  placeholder,
  name,
  register,
  errors,
  type ='text',
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  const isPasswordType = type === 'password';
  const IconEye = showPassword ? IconEyeOpen : IconEyeClosed;


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 공통 스타일 정의
  const baseStyle = clsx(
    'rounded-[10px] px-5 transition-all',
    'text-gray-400 placeholder:text-gray-200',
    'border border-light border-transparent focus:outline-none focus:border-dark',
    VARIANTS[variant],
    SIZES[sizeVariant]
  )

  return (
    <div className={twMerge('flex flex-col gap-2 transition-all', className)}>
      {label && (
        <label htmlFor={id || name } className="font-roboto text-caption text-start">
          {label}
        </label>
      )}
      <div className={twMerge("relative",  SIZES[sizeVariant])}>
          <input
            id={id ?? name}
            type={isPasswordType && showPassword ? "text" : type}
            placeholder={placeholder}
            className={twMerge(baseStyle, hasError && 'border-red bg-red/20')}
            {...register}
            {...rest}
          />

        {isPasswordType && (
          <span
            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
            role="button"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
          >
            <IconEye size={20} color="var(--color-gray-200)"/>
          </span>
        )}
      </div>
      {hasError && <p className="text-caption text-error" role="alert">{errorMessage}</p>}
    </div>
  )
}