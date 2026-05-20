import Button from "@/components/common/Button";
import { TabBar } from "@/components/common/TabBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { MousePointer } from "lucide-react";

export default function MainPage() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header />

      {/* main */}
      <main className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        {/* TabBar*/}
        <div className="w-full z-10">
          <TabBar />
        </div>

        {/* content */}
        <section className="w-full h-[800px] lg:h-[600px] flex items-center p-10 bg-white">
          <div className="w-full h-full flex items-end justify-between p-4 border border-2 border-dashed border-dark">
            <div className="flex flex-col h-full items-start justify-between">
              <div className="flex flex-col items-start gap-5">
                <h1 className="text-main lg:text-main-hero font-roboto font-semibold text-black">Start to Arkive<br/>Your-Travel</h1>
                <Link href="/create">
                  <Button
                    type="button"
                    variant="primary"
                    sizeVariant="sm"
                    className="text-subtitle-md"
                  >
                    시작하기
                  </Button>
                </Link>
              </div>
              <h2 className="text-body font-medium text-black">당신의 여행을 TRAK에서 저장해보세요.</h2>
            </div>
            <MousePointer size={200} strokeWidth={1}/>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  )
}