import React, { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from 'clsx';
import { twMerge } from "tailwind-merge";
import { FieldErrors, FieldValues, UseFormRegisterReturn} from 'react-hook-form';
import { LuEye as IconEyeOpen, LuEyeClosed as IconEyeClosed } from "react-icons/lu";

const VARIANTS = {
  filled: "bg-gray-200/20 text-14 focus:bg-white border border-none focus:border-light",
  outlined: "bg-white text-14",
} as const;

const SIZES =  {
  lg: "w-[500px] h-[50px]",
  md: "w-[360px] h-[50px]",
  sm: "w-[300px] h-[50px]",
  hashtag: "w-[420px] h-[50px]",
  desLg: "w-[750px] h-[250px] p-5",
  desMd: "w-[700px] h-[215px] p-5",
} as const;

type TouchedFieldsType<TFieldValues extends FieldValues> = {
  [K in keyof TFieldValues]?: boolean;
}

type CommonProps = {
  label?: string;
  variant?: keyof typeof VARIANTS;
  sizeVariant?: keyof typeof SIZES;
  name: string;
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  touchFields?: TouchedFieldsType<FieldValues>
  className?: string;
  id?: string;
  placeholder?: string;
}

// isTextArea 값에 따라 허용 속성을 다르게 분류
type InputProps = 
  | ({ isTextArea: true} & CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({ isTextArea?: false} & CommonProps & InputHTMLAttributes<HTMLInputElement>);

export default function Input({
  variant = 'outlined',
  sizeVariant ='md',
  isTextArea = false,
  label,
  className,
  id,
  placeholder,
  name,
  register,
  errors,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const errorMessage = errors?.[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  // isTextArea가 false일 때만 type이 존재함
  const type = !isTextArea ? (rest as InputHTMLAttributes<HTMLInputElement>).type : undefined;
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

  return (
    <div className={twMerge('flex flex-col gap-2 transition-all', className)}>
      {label && (
        <label htmlFor={id || name } className="font-roboto text-12 text-start">
          {label}
        </label>
      )}
      <div className={twMerge("relative",  SIZES[sizeVariant])}>
        {isTextArea ? (
          <textarea
            id={id ?? name}
            placeholder={placeholder}
            className={twMerge(baseStyle, hasError && errorClasses)}
            {...register}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={id ?? name}
            type={isPasswordType && showPassword ? "text" : (type ?? "text")}
            placeholder={placeholder}
            className={twMerge(baseStyle, hasError && errorClasses)}
            {...register}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {!isTextArea && isPasswordType && (
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
      {hasError && <p className="text-12 text-error" role="alert">{errorMessage}</p>}
    </div>
  )
}