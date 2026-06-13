import Link from "next/link";
import Button from "@/components/common/Button";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Header />

      <main className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        <div className="w-full z-10">
          <TabBar />
        </div>

        <section className="w-full h-[720px] lg:h-[600px] flex items-center p-10 bg-white">
          <div className="w-full h-full flex flex-col justify-between p-8 lg:p-10 border border-2 border-dashed border-dark">
            <div className="flex flex-col gap-4">
              <p className="text-subtitle-md font-semibold text-gray-300">404 NOT FOUND</p>
              <h1 className="text-main lg:text-main-hero font-semibold text-black leading-none">
                Lost<br />Archive
              </h1>
            </div>

            <div className="flex flex-col gap-6">
              <p className="max-w-[560px] text-body text-gray-300 leading-relaxed">
                찾으려는 페이지가 존재하지 않거나 주소가 변경되었어요.{" "}
                <br className="hidden lg:inline" />
                저장된 여행 기록은 메인 페이지에서 다시 확인할 수 있습니다.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/main">
                  <Button
                    type="button"
                    variant="primary"
                    sizeVariant="sm"
                    className="text-body font-noto"
                    isActive
                  >
                    메인으로
                  </Button>
                </Link>

                <Link href="/">
                  <Button
                    type="button"
                    variant="outlined"
                    sizeVariant="sm"
                    className="text-body font-noto"
                  >
                    시작 화면
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
