
'use client'
import { ColorPalette } from "@/components/common/ColorPalette/ColorPalette";
import { TabBar } from "@/components/common/TabBar";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import type { TrakColor } from "@/components/common/ColorPalette/ColorSwatch";
import Input from "@/components/common/Input";
import Textarea from "@/components/common/Textarea";
import Button from "@/components/common/Button";
import ImageUploadInput from "@/components/common/ImageUploadInput";

function FormButtons() {
  return (
    <div className="flex w-full items-center justify-between gap-6 ">
      <Button type="button" variant="outlined" sizeVariant="sm" className="shrink-0">
        취소
      </Button>
      <Button type="submit" variant="filled" sizeVariant="md">
        아카이브 만들기
      </Button>
    </div>
  );
}

export default function CreatePage() {
  const [dropdownValue, setDropdownValue] = useState<string>("");

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center">
      <Header/>
      <main  className="w-full flex-1 flex flex-col px-[40px] lg:px-[70px] py-[70px] items-center">
        <div className="w-full z-10">
          <TabBar/>
        </div>
        {/* content */}
        <section className="w-full flex items-center p-10 bg-white">
          <div className="w-full flex flex-col items-start gap-5 p-4 border border-2 border-dashed border-dark">

            {/* title */}
            <div className="flex px-3 py-1 gap-3 items-center">
              <ColorPalette 
                mode="dropdown"
                value={dropdownValue}
                onChange={(color: TrakColor) => setDropdownValue(color.hex)}
              />
              <h1 className="text-subtitle-lg text-medium">아카이브 만들기</h1>
            </div>

            {/* create form */}
            <form className="w-full flex flex-col items-start gap-6">
              <div className="w-full flex flex-row items-stretch gap-6 lg:gap-10">
                <div className="flex-shrink-0 w-[30%] lg:w-[420px] h-full flex flex-col items-start gap-5">
                  <ImageUploadInput
                    label="대표 이미지"
                    name="cover_imqge_url"
                  />
                  
                  <Input
                    name="hashtag"
                    label="해시태그" 
                    placeholder="예: HONGKONG"
                    variant="outlined"
                    sizeVariant="hashtag"
                    className="w-full" 
                    inputClassName="max-w-full"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-3 items-stretch justify-between">
                  <div className="flex flex-col lg:flex-row w-full gap-3">
                    <Input
                      name="title"
                      label="제목"
                      placeholder="예: HONGKONG"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                    />
                    <Input
                      name="location"
                      label="장소"
                      placeholder="예: HONGKONG"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                    />
                  </div>
                  <div className="flex flex-col lg:flex-row w-full gap-3">
                    <Input
                      name="start_at"
                      label="시작일"
                      placeholder="예: YYYY.MM.DD"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                    />
                    <Input
                      name="end_at"
                      label="종료일"
                      placeholder="예: YYYY.MM.DD"
                      variant="outlined"
                      sizeVariant="md"
                      className="flex-1 min-w-0" 
                      inputClassName="w-full max-w-full"
                    />
                  </div>
                  <Textarea
                    name="description"
                    label="설명"
                    placeholder="여행에 대한 설명을 입력하세요."
                    sizeVariant="lg"
                  />
                  <div className="hidden lg:block w-full">
                    <FormButtons />
                  </div>
                </div>
              </div>
              <div className="block lg:hidden w-full">
                <FormButtons />
              </div>
              
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}