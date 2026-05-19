'use client';

import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: { children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLoginPage = pathname?.includes('login');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background lg:bg-white lg:flex-row">
      {/* Logo 및 ad 영역 */}
      <div className="flex flex-col w-full h-[300px] items-center justify-center bg-background lg:w-[700px] lg:h-screen lg:shrink-0">
        <div className="flex flex-col w-full gap-3 lg:gap-10 items-center justify-center ">
          <h1 className="font-archivo text-primary text-main-hero lg:text-logo">TRAK</h1>
          {isLoginPage ? (
            <>
              <p className="font-roboto text-gray-200 text-center text-base lg:text-body">
              여행을 아카이브로 기록하고{" "}
              <br className="hidden lg:inline" />
              소중한 추억들을 영원히 보관하세요.</p>
            <p className="font-roboto text-gray-200 text-center text-base lg:text-body">
              당신만의 여행 다이어리를{" "}
              <br className="hidden lg:inline" />
              지금 시작해보세요.</p>
            </>
          ) : (
            <>
              <p className="font-roboto text-gray-200 text-center text-base lg:text-body">
              새 계정을 만들고{" "}
              <br className="hidden lg:inline" />
              나만의 여행 아카이브를{" "}
              <br className="hidden lg:inline" />
              시작해보세요.</p>
            <p className="font-roboto text-gray-200 text-center text-base lg:text-body">
              무료로 무제한 여행을 
              <br className="hidden lg:inline" />
              기록할 수 있어요.</p>
            </>
          )}
        </div>
      </div>
      

      {/* [폼 컨테이너 영역] */}
      <div className="relative z-10 flex flex-1 w-full h-[900px] items-center justify-center px-6 py-12 bg-white rounded-t-[50px] lg:h-screen lg:flex-1 lg:rounded-none lg:px-16 lg:p-0">
        <div className="w-full max-w-[500px]">
          {children}
        </div>

      </div>
    </div>
  )
}