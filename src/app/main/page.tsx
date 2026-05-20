import Button from "@/components/common/Button";
import { TabBar } from "@/components/common/TabBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function MainPage() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header />

      {/* main */}
      <main className="flex-1 flex flex-col pt-[60px]">
        {/* TabBar*/}
        <div className="relative z-10">
          <TabBar />
        </div>

        {/* content */}
        <section className="w-[1340px] h-[600px] flex items-center p-10">
          <div className="w-full h-full flex items-end p-4">
            <div className="flex flex-col h-full items-start justify-between">
              <div className="flex flex-col items-start gap-5">
                <h1 className="text-main-hero font-medium text-black">Start to Arkive<br/>Your-Travel</h1>
                <Button
                  variant="primary"
                  sizeVariant="sm"
                >
                  시작하기
                </Button>
              </div>
              <h2 className="text-subtitle-lg font-medium text-black">당신의 여행을 TRAK에서 저장해보세요.</h2>
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  )
}