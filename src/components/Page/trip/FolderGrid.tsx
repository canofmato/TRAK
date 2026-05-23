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
  onAddClick?: () => void;
}

const folderIconMap = {
  amber: FolderAmber,
  blue: FolderBlue,
  rose: FolderRose,
  lime: FolderLime,
  gray: FolderGray,
} as const;

type FolderColor = keyof typeof folderIconMap;

export default function FolderGrid({folders = [], className, onAddClick }: FolderGridProps) {
  const tabletFolders = [...folders].reverse();
  const isFull = folders.length >= 4;

  return (
    <>
      <ul className={twMerge("hidden lg:grid grid-cols-2 gap-[30px] w-max", className)}>
        {folders?.map((folder, index) => {
          const gridClasses = [
            "row-start-2 col-start-1", // 1번째 폴더: 좌하단
            "row-start-1 col-start-2", // 2번째 폴더: 우상단
            "row-start-1 col-start-1", // 3번째 폴더: 좌상단
            "row-start-2 col-start-2", // 4번째 폴더: 우하단 (폴더가 4개일 때만)
          ];
          
          const colorKey = (folder.color as FolderColor) || 'gray';
          const FolderIcon = folderIconMap[colorKey] || folderIconMap.gray;

          return (
            <li
              key={folder.id} 
              className={twMerge("relative w-[140px] cursor-pointer",gridClasses[index])}
            >
              <FolderIcon className="w-full h-auto drop-shadow-sm" />
              <span className="absolute inset-0 flex items-center justify-center font-semibold text-gray-700 px-3 pt-3 truncate pointer-events-none">
                {folder.name}
              </span>
            </li>
          )
        })}
        {!isFull && (
          <li 
            className="relative w-[140px] row-start-2 col-start-2 shrink-0 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
            onClick={onAddClick}
          >
            <FolderGray className="w-full h-auto" />
            <span className="absolute inset-0 flex items-center justify-center text-heading-lg font-semibold text-black pt-3 pointer-events-none">
              +
            </span>
          </li>
        )}
      </ul>

      {/* 테블릿 전용 */}
      <ul className={twMerge("flex lg:hidden flex-nowrap overflow-x-auto pb-4 gap-4 scrollbar-hide", className)}>
        {tabletFolders?.map((folder) => {
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
        {!isFull && (
          <li 
            className="relative w-[140px] shrink-0 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
            onClick={onAddClick}
          >
            <FolderGray className="w-full h-auto" />
            <span className="absolute inset-0 flex items-center justify-center text-heading-lg font-semibold text-black pt-3 pointer-events-none">
              +
            </span>
          </li>
        )}
      </ul>
    </>
  )
}