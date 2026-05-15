import React, { InputHTMLAttributes } from "react";
import clsx from 'clsx';
import { twMerge } from "tailwind-merge";
import { FieldErrors, FieldValues, UseFormRegisterReturn} from 'react-hook-form';
import { LuEye as IconEyeOpen, LuEyeClosed as IconEyeClosed } from "react-icons/lu";

const VARIANTS = {
  filled: "bg-gray-200/20 text-16 focus:bg-white",
  outlined: "bg-white text-20",
};

const SIZES =  {
  lg: "w-[600px] h-[60px]",
  md: "w-[360px] h-[60px]",
  sm: "w-[300px] h-[60px]",
  hashtag: "w-[420px] h-[60px]",
  desLg: "w-[750px] h-[250px] p-5",
  desMd: "w-[700px] h-[215px] p-5",
}

type TouchedFieldsType<TFieldValues extends FieldValues> = {
  [K in keyof TFieldValues]?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement & HTMLTextAreaElement> {
  label?: string;
  variant?: keyof typeof VARIANTS;
  sizeVariant?: keyof typeof SIZES;
  isTextArea?: boolean;
  name: string;
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  touchFields?: TouchedFieldsType<FieldValues>
}

export default function Input({
  variant = 'outlined',
  sizeVariant ='md',
  isTextArea = false,
  label,
  className,
  id,
  type,
  placeholder,
  name,
  register,
  errors,
  touchFields,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage && touchFields?.[name];

  const isPasswordType = type === 'password';
  const IconEye = showPassword ? IconEyeOpen : IconEyeClosed;


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // 공통 스타일 정의
  const baseStyle = clsx(
    'rounded-[10px] px-5 transition-all',
    'text-gray-400 placeholder:text-gray-200',
    'border border-light border-transparent focus:border-gray-300',
    VARIANTS[variant],
    SIZES[sizeVariant]
  )

  const errorClasses = clsx('border-red bg-error/20');

  const Component = isTextArea ? 'textarea' : 'input';

  return (
    <div className={twMerge('flex flex-col gap-2 transition-all', className)}>
      {label && (
        <label htmlFor={id || name } className="font-roboto text-16 text-start">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <Component
          id={id || name}
          // textarea일때는 type을 아예 제외
          {...(!isTextArea && {type: isPasswordType && showPassword ? 'text' : type})}
          placeholder={placeholder}
          className={twMerge(baseStyle, hasError && errorClasses)}
          {...register}
          {...rest }
        />

        {!isTextArea && isPasswordType && (
          <span
            className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            <IconEye size={20} color="var(--color-gray-200)"/>
          </span>
        )}
      </div>
      {hasError && <p className="text-12 text-error">{errorMessage}</p>}
    </div>
  )
}