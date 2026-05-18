import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: "bg-primary text-20 text-gray-200 active:text-gray-400 active:border active:border-2 active:border-blue",
  outlined: "bg-white text-gray-200 active:text-gray-400 border-light active:border-dark",
  filled: "bg-gray-200 active:bg-gray-400 text-white",
  delete: "bg-white border border-red text-red"
} as const;

const SIZES = {
  lg: "w-[600px]",
  md: "w-[470px]",
  sm: "w-[200px]",
  ss: "w-[60px]",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  sizeVariant?: keyof typeof SIZES;
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
    'h-[60px] rounded-[10px] flex items-center justify-center transition-all',
    VARIANTS[variant],
    SIZES[sizeVariant],
  ), className)

  return (
    <button className={baseStyle} {...rest}>
      {children}
    </button>
  )
}