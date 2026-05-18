import Link from "next/link";
import Logo from "@/assets/icons/LOGO.svg";

export function Footer() {
  return (
    <footer className="w-full h-[70px] px-[70px] flex items-center justify-between border-t border-darker">
      <div className="flex gap-10 items-center">
        <Link
          href="/terms"
          className="text-24 font-semibold text-black hover:text-gray-400 transition-colors"
        >
          TERMS
        </Link>
        <Link
          href="/blog"
          className="text-24 font-semibold text-black hover:text-gray-400 transition-colors"
        >
          BLOG
        </Link>
        <Link
          href="/contact"
          className="text-24 font-semibold text-black hover:text-gray-400 transition-colors"
        >
          CONTACT
        </Link>
      </div>

      <Link
        href="/main"
        aria-label="홈으로 이동"
      >
        <Logo className="w-auto h-[50px]" />
      </Link>

      <span className="text-20 text-black">
        ©2026 canofmato. All rights reserved
      </span>
    </footer>
  )
}