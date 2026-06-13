import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";

const INFO_SECTIONS = [
  {
    id: "terms",
    eyebrow: "TERMS",
    title: "서비스 이용약관",
    body: [
      "제1조 목적\n이 약관은 TRAK이 제공하는 여행 기록 아카이브 서비스의 이용 조건과 절차, 사용자와 서비스의 권리 및 의무를 정하는 것을 목적으로 합니다.",
      "제2조 서비스 내용\nTRAK은 사용자가 여행 정보, 사진, 폴더, 위치 정보 등을 저장하고 관리할 수 있는 기능을 제공합니다. 서비스의 세부 기능은 운영 상황에 따라 변경되거나 개선될 수 있습니다.",
      "제3조 회원 계정\n사용자는 정확한 정보를 바탕으로 계정을 생성해야 하며, 계정과 비밀번호 관리 책임은 사용자에게 있습니다. 사용자의 부주의로 발생한 문제에 대해 서비스는 책임을 지지 않습니다.",
      "제4조 사용자 콘텐츠\n사용자가 업로드한 여행 기록과 사진의 권리는 원칙적으로 사용자에게 있습니다. 다만 서비스 제공을 위해 필요한 범위 안에서 해당 콘텐츠가 저장, 표시, 처리될 수 있습니다.",
      "제5조 금지 행위\n사용자는 타인의 권리를 침해하는 콘텐츠, 불법적이거나 부적절한 정보, 서비스 운영을 방해하는 행위를 등록하거나 수행해서는 안 됩니다.",
      "제6조 서비스 변경 및 중단\nTRAK은 안정적인 운영을 위해 서비스의 일부 또는 전체를 변경, 중단, 점검할 수 있습니다. 중요한 변경 사항이 있는 경우 가능한 범위에서 사전에 안내합니다.",
      "제7조 개인정보 보호\n서비스는 사용자의 개인정보를 관련 법령과 개인정보 처리방침에 따라 보호합니다. 사용자의 개인정보는 서비스 제공과 계정 관리에 필요한 범위 안에서 처리됩니다.",
      "제8조 약관 변경\n이 약관은 서비스 운영 상황이나 관련 법령의 변경에 따라 수정될 수 있습니다. 변경된 약관은 서비스 내 공지 또는 별도 안내를 통해 적용됩니다.",
    ],
  },
  {
    id: "blog",
    eyebrow: "BLOG",
    title: "TRAK 이야기",
    body: [
      "TRAK은 여행을 단순한 사진 목록이 아니라 다시 꺼내볼 수 있는 기록으로 남기기 위해 만들어졌습니다.",
      "지역별 여행, 사진 폴더, 지도 기반 기록을 통해 여행의 흐름과 분위기를 한곳에서 살펴볼 수 있도록 다듬고 있어요.",
      "앞으로는 여행 기록을 더 쉽게 정리하고 공유할 수 있는 기능들을 천천히 추가할 예정입니다.",
    ],
  },
  {
    id: "contact",
    eyebrow: "CONTACT",
    title: "문의하기",
    body: [
      "서비스 이용 중 문제가 있거나 제안하고 싶은 기능이 있다면 언제든 알려주세요.",
      "계정, 사진 업로드, 여행 기록 관리와 관련된 문의는 가능한 한 자세한 상황과 함께 보내주시면 더 빠르게 확인할 수 있습니다.",
      "TRAK은 사용자의 여행 기록이 편안하게 쌓일 수 있는 방향으로 계속 개선됩니다.",
    ],
  },
];

export default function InfoPage() {
  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header />

      <main className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        <div className="w-full z-10">
          <TabBar />
        </div>

        <section className="w-full flex items-center p-10 bg-white">
          <div className="w-full flex flex-col gap-16 p-8 lg:p-10 border border-2 border-dashed border-dark">
            <div className="flex flex-col gap-3">
              <p className="text-base font-semibold text-gray-300">INFO</p>
              <h1 className="text-heading-md lg:text-heading-lg font-semibold text-black">
                TRAK 안내
              </h1>
              <p className="max-w-[760px] text-body text-gray-300 leading-relaxed">
                서비스 이용 안내, 업데이트 이야기, 문의 정보를 한 페이지에서 확인할 수 있어요.
              </p>
            </div>

            <div className="flex flex-col gap-14">
              {INFO_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-[100px] flex flex-col gap-5 border-t border-light pt-10"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-subtitle-md font-semibold text-gray-300">
                      # {section.eyebrow}
                    </p>
                    <h2 className="text-heading-sm font-semibold text-black">
                      {section.title}
                    </h2>
                  </div>

                  <div className="flex max-w-[900px] flex-col gap-3">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-body text-gray-400 leading-relaxed whitespace-pre-wrap"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
