'use client';

import { PhotoFolder } from "@/types/database.types";
import { twMerge } from "tailwind-merge";

import FolderAmber from "@/assets/icons/folder-amber.svg"
import FolderBlue from "@/assets/icons/folder-blue.svg"
import FolderRose from "@/assets/icons/folder-rose.svg"
import FolderLime from "@/assets/icons/folder-lime.svg"
import FolderGray from "@/assets/icons/folder-gray.svg"

interface FolderGridProps {
  folders?: PhotoFolder[];
  className?: string;
}

const folderIconMap = {
  amber: FolderAmber,
  blue: FolderBlue,
  rose: FolderRose,
  lime: FolderLime,
  gray: FolderGray,
} as const;

type FolderColor = keyof typeof folderIconMap;

export default function FolderGrid({ folders, className }: FolderGridProps) {
  return (
    <ul className={twMerge("flex flex-nowrap overflow-x-auto pb-4 lg:pb-0 lg:flex-wrap gap-4 lg:gap-[30px] scrollbar-hide", className)}>
      {folders?.map((folder) => {
        const colorKey = (folder.color as FolderColor) || 'gray';
        const FolderIcon = folderIconMap[colorKey] || folderIconMap.gray;

        return (
          <li
            key={folder.id} 
            className="relative w-[140px] shrink-0 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
          >
            <FolderIcon className="w-full h-auto drop-shadow-sm" />
            <span className="absolute inset-0 flex items-center justify-center font-semibold text-gray-700 px-3 pt-3 truncate pointer-events-none">
              {folder.name}
            </span>
          </li>
        )
      })}
      <li 
        className="relative w-[140px] shrink-0 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
        onClick={() => {
          // TODO: 폴더 추가 모달 오픈 또는 추가 로직 연결
        }}
      >
        <FolderGray className="w-full h-auto" />
        
        <span className="absolute inset-0 flex items-center justify-center text-heading-lg font-semibold text-black pt-3 pointer-events-none">
          +
        </span>
      </li>

    </ul>
  )
}