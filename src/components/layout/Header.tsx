import Link from "next/link";

export function Header() {
  return (
    <header className="w-full h-[60px] px-[70px] py-6 flex items-center justify-between border-b border-darker">
      <Link
        href="/main"
        className="text-subtitle-lg font-semibold text-black hover:text-gray-400 transition-colors"
      >
        Home
      </Link>

      <div className="flex items-center gap-[150px]">
        <Link
        href="/map"
        className="text-subtitle-lg font-semibold text-black hover:text-gray-400 transition-colors"
      >
        Map
      </Link>

      <Link
        href="/profile"
        className="text-subtitle-lg font-semibold text-black hover:text-gray-400 transition-colors"
      >
        Profile
      </Link>
      </div>
    </header>
  )
}