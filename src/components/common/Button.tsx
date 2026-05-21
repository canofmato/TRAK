import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: {
    base: "bg-primary text-base text-gray-200",
    active: "text-gray-400 border border-2 border-blue",
  },
  filled:{
    base: "bg-gray-200 text-white",
    active: "bg-gray-400",
  },
  outlined: {
    base: "bg-white text-base text-gray-200 hover:text-gray-400 border border-light",
    active: undefined,
  },
  delete: {
    base: "bg-white border border-red text-red",
    active: undefined,
  },
} as const;

const SIZES = {
  lg: "w-full max-w-[500px]",
  md: "w-full max-w-[470px]",
  sm: "w-full w-[250px]",
  ss: "w-[60px]",
} as const;

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  sizeVariant?: ButtonSize;
  className?: string;
  isActive?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  sizeVariant ='md', 
  className, 
  isActive = false,
  children, 
  ...rest
}: ButtonProps) {

  const { base, active } = VARIANTS[variant];

  const baseStyle = twMerge(clsx(
    'h-[50px] rounded-[10px] flex items-center justify-center transition-all',
    base,
    SIZES[sizeVariant],
    isActive && active,
  ), className);

  return (
    <button className={baseStyle} {...rest}>
      {children}
    </button>
  )
}