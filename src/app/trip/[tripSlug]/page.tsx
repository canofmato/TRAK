
'use client'
import { TabBar } from "@/components/common/TabBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function CreatePage() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header/>
      <main  className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        <div className="w-full z-10">
          <TabBar/>
        </div>
        {/* content */}
        <section className="w-full flex items-center p-10 bg-">
          <div className="w-full flex flex-col items-start gap-5 p-4 border border-2 border-dashed border-dark">
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}