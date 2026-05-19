import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: "bg-primary text-base text-gray-200 active:text-gray-400 active:border active:border-2 active:border-blue",
  outlined: "bg-white text-base text-gray-200 active:text-gray-400 border border-light active:border-dark",
  filled: "bg-gray-200 active:bg-gray-400 text-white",
  delete: "bg-white border border-red text-red"
} as const;

const SIZES = {
  lg: "w-[500px]",
  md: "w-[470px]",
  sm: "w-[200px]",
  ss: "w-[60px]",
} as const;

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  sizeVariant?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  sizeVariant ='md', 
  className, 
  children, 
  ...rest
}: ButtonProps) {

  const baseStyle = twMerge(clsx(
    'h-[50px] rounded-[10px] flex items-center justify-center transition-all',
    VARIANTS[variant],
    SIZES[sizeVariant],
  ), className)

  return (
    <button className={baseStyle} {...rest}>
      {children}
    </button>
  )
}