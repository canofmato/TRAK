import Link from "next/link";
import Logo from "@/assets/icons/Logo.svg";

export function Footer() {
  return (
    <footer className="w-full h-[60px] px-[40px] lg:px-[70px] flex items-center justify-between border-t border-darker">
      <div className="flex gap-10 items-center">
        <Link
          href="/info#terms"
          className="text-body lg:text-subtitle-md font-semibold text-black hover:text-gray-400 transition-colors"
        >
          TERMS
        </Link>
        <Link
          href="/info#blog"
          className="text-body lg:text-subtitle-md font-semibold text-black hover:text-gray-400 transition-colors"
        >
          BLOG
        </Link>
        <Link
          href="/info#contact"
          className="text-body lg:text-subtitle-md font-semibold text-black hover:text-gray-400 transition-colors"
        >
          CONTACT
        </Link>
      </div>

      <Link href="/main" aria-label="홈으로 이동">
        <Logo className="h-[50px] aspect-square shrink-0"/>
      </Link>

      <span className="text-caption lg:text-body text-black">
        ©2026 canofmato. All rights reserved
      </span>
    </footer>
  )
}
