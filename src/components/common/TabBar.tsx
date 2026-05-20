'use client'

import { useTabStore } from "@/store/tabStore";
import type { TripTab } from "@/types/trip"
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";

interface TabItemProps {
  tab: TripTab;
  isActive: boolean;
  index: number;
  total: number;
};

const TAB_STYLES = {
  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
  width: '260px',
  height: '60px',
} as const;

const TAB_SHADOW_STYLES = {
  filter: 'drop-shadow(4px 0px 4px rgba(0,0,0,0.25))',
} as const;

function TabItem({ tab, isActive, index, total }: TabItemProps) {
  const { removeTab, setActive } = useTabStore();
  const router = useRouter();

  const handleClick = () => {
    setActive(tab.tripSlug);
    router.push(`/trip/${tab.tripSlug}`);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeTab(tab.tripSlug);
  };

  return (
    <li className="-ml-3 first:ml-0" style={{ zIndex: isActive ? total + 1 : total - index }}>
      <div style={TAB_SHADOW_STYLES}>
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          aria-current={isActive ? 'page' : undefined}
          aria-label={`${tab.title} 여행 탭`}
          className="relative flex items-center cursor-pointer select-none
                    transition-opacity hover:opacity-90 focus-visible:outline-none"
          style={{
            ...TAB_STYLES,
            backgroundColor: tab.color,
            opacity: isActive ? 1 : 0.7,
          }}
          >
            {/* skew 상쇄 — 내부 콘텐츠 정방향 */}
            <span className="flex items-center gap-2 px-8 w-full">
              <span className="truncate text-subtitle-lg font-semibold text-white flex-1">
                {tab.title}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                aria-label={`${tab.title} 탭 닫기`}
                className="shrink-0 p-0.5 text-white/70 hover:text-white transition-colors"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </span>
          </div>
        </div>
    </li>
  )
}

function DefaultTab({index, total }: { index: number; total: number }) {
  return (
    <li style={{ zIndex: total - index }}>
      <div style={TAB_SHADOW_STYLES}>
        <div
          aria-hidden="true"
          className="bg-white "
          style={TAB_STYLES}
        />
       </div>
    </li>
  )
}

function MoreTab() {
  return (
    <li className="-ml-12" style={{ zIndex: 0 }} >
      <div style={TAB_SHADOW_STYLES}>
        <Link
          href="/profile"
          aria-label="전체 여행 목록 보기"
          className="flex items-center justify-center bg-gray-500 transition-opacity hover:opacity-90 focus-visible:outline-none"
          style={TAB_STYLES}
        >
          <span className="text-subtitle-lg font-semibold text-white">
            More
          </span>
        </Link>
      </div>
    </li>
  )
}

export function TabBar() {
  const { tabs, activeSlug } = useTabStore();
  const total = tabs.length + 1;

  return (
    <nav aria-label="고정된 여행 탭">
      <ol className="flex items-end w-[1340px]">
        <DefaultTab index={0} total={total} />
        {tabs.map((tab, i) => (
          <TabItem
            key={tab.tripSlug}
            tab={tab}
            isActive={tab.tripSlug === activeSlug}
            index={i + 1}
            total={total}
          />
        ))}
        <MoreTab />
      </ol>
    </nav>
  )
}