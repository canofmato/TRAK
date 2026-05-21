
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
        <section className="w-full h-[1000px] lg:h-[800px] flex items-center p-10 bg-white">
          <div className="w-full h-full flex flex-col items-start gap-5 p-4 border border-2 border-dashed border-dark">
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
            <form className="w-full flex items-start justify-between">
              <div className="w-[420px] flex flex-col items-start gap-5">
                <ImageUploadInput
                  label="대표 이미지"
                  name="cover_imqge_url"
                />
                
                <div className="flex items-center gap-[10px]">
                <Input
                  name="hashtag"
                  label="해시태그" 
                  placeholder="예: HONGKONG"
                  variant="outlined"
                  sizeVariant="hashtag"
                />
                </div>
              </div>
              <div className="flex flex-col w-full max-w-[750px] h-full items-center justify-between">
                <div className="flex w-full items-center justify-between">
                  <Input
                    name="title"
                    label="제목"
                    placeholder="예: HONGKONG"
                    variant="outlined"
                    sizeVariant="md"
                  />
                  <Input
                    name="location"
                    label="장소"
                    placeholder="예: HONGKONG"
                    variant="outlined"
                    sizeVariant="md"
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <Input
                    name="start_at"
                    label="시작일"
                    placeholder="예: YYYY.MM.DD"
                    variant="outlined"
                    sizeVariant="md"
                  />
                  <Input
                    name="end_at"
                    label="종료일"
                    placeholder="예: YYYY.MM.DD"
                    variant="outlined"
                    sizeVariant="md"
                  />
                </div>
                <Textarea
                  name="description"
                  label="설명"
                  placeholder="여행에 대한 설명을 입력하세요."
                  sizeVariant="lg"
                />
                <div className="flex w-full items-center justify-between">
                  <Button
                    type="submit"
                    variant="outlined"
                    sizeVariant="sm"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="filled"
                    sizeVariant="lg"
                  >
                    아카이브 만들기
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}