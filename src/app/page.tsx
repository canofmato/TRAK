// Landing Page
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Card {
  id: number;
  label: string;
  title: string;
  body: string;
  accent: string;
  textColor: string;
  rotation: string;
  tag?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const CARDS: Card[] = [
  {
    id: 1,
    label: "01 / Archive",
    title: "여행을\n데이터로.",
    body: "SNS의 타임라인에 묻히는 기억 말고,\n내가 직접 꺼내볼 수 있는 아카이브.",
    accent: "var(--color-primary)",
    textColor: "var(--color-black)",
    rotation: "rotate-[-3deg]",
    tag: "PRIVATE ARCHIVE",
  },
  {
    id: 2,
    label: "02 / Structure",
    title: "Trip →\nFolder →\nPhoto.",
    body: "여행 단위로 독립된 공간.\n폴더로 순간을 분류하고\n사진마다 감정을 기록하세요.",
    accent: "var(--color-amber)",
    textColor: "var(--color-black)",
    rotation: "rotate-[2deg]",
    tag: "ORGANIZED",
  },
  {
    id: 3,
    label: "03 / Map",
    title: "발자취를\n지도 위에.",
    body: "다녀온 모든 여행지가\n지도 위 하나의 점으로 남습니다.\n당신만의 세계 지도.",
    accent: "var(--color-lime)",
    textColor: "var(--color-black)",
    rotation: "rotate-[-1.5deg]",
    tag: "VISUAL TRAIL",
  },
  {
    id: 4,
    label: "04 / Yours",
    title: "오직\n나만의\n기록.",
    body: "좋아요도, 팔로워도 없습니다.\n보여주기 위한 게 아닌\n나를 위한 디지털 일기장.",
    accent: "var(--color-rose)",
    textColor: "var(--color-black)",
    rotation: "rotate-[1deg]",
    tag: "NO AUDIENCE",
  },
];

// ─── Card Component ───────────────────────────────────────────────────────────

function ArchiveCard({
  card,
  progress,
  index,
  total,
}: {
  card: Card;
  progress: number;
  index: number;
  total: number;
}) {
  // Each card rises based on scroll progress assigned to it
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;
  const cardProgress = Math.max(
    0,
    Math.min(1, (progress - cardStart) / (cardEnd - cardStart))
  );

  // translateY: starts at 60px below peek position, rises to full reveal
  const translateY = 60 - cardProgress * 260;
  const opacity = 0.3 + cardProgress * 0.7;

  return (
    <div
      className="absolute w-full"
      style={{
        bottom: `${index * 8}px`,
        transform: `translateY(${translateY}px)`,
        opacity,
        transition: "none",
        zIndex: index + 1,
      }}
    >
      <div
        className={`relative mx-auto w-[320px] rounded-[16px] p-7 shadow-[0_8px_40px_rgba(0,0,0,0.12)] ${card.rotation}`}
        style={{ backgroundColor: card.accent }}
      >
        {/* Tag */}
        {card.tag && (
          <span
            className="mb-4 inline-block rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.2em]"
            style={{
              borderColor:
                card.textColor === "var(--color-black)"
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(255,255,255,0.3)",
              color: card.textColor,
              opacity: 0.7,
            }}
          >
            {card.tag}
          </span>
        )}

        {/* Label */}
        <p
          className="mb-3 font-mono text-[11px] tracking-widest"
          style={{ color: card.textColor, opacity: 0.5 }}
        >
          {card.label}
        </p>

        {/* Title */}
        <h2
          className="mb-4 text-[28px] font-black leading-[1.15] tracking-tight"
          style={{
            color: card.textColor,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            whiteSpace: "pre-line",
          }}
        >
          {card.title}
        </h2>

        {/* Body */}
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: card.textColor, opacity: 0.65, whiteSpace: "pre-line" }}
        >
          {card.body}
        </p>

        {/* Corner stamp */}
        <div
          className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full border-2 text-[9px] font-bold tracking-widest"
          style={{
            borderColor:
              card.textColor === "var(--color-black)"
                ? "rgba(0,0,0,0.15)"
                : "rgba(255,255,255,0.2)",
            color: card.textColor,
            opacity: 0.4,
          }}
        >
          TRAK
        </div>
      </div>
    </div>
  );
}

// ─── Envelope Component ───────────────────────────────────────────────────────

function Envelope({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-[420px] w-[360px]">
      {/* Cards container — sits above envelope body */}
      <div className="absolute bottom-[120px] left-0 right-0 h-[320px]">
        {children}
      </div>

      {/* Envelope body */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] rounded-b-[20px] rounded-t-[4px]"
        style={{ backgroundColor: "var(--color-primary)", zIndex: 10 }}
      >
        {/* Envelope fold line */}
        <div
          className="absolute left-0 right-0 top-0 h-[1px]"
          style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
        />
        {/* V-fold lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 360 200"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0"
            x2="180"
            y2="90"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
          <line
            x1="360"
            y1="0"
            x2="180"
            y2="90"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
        </svg>

        {/* Envelope label */}
        <p
          className="absolute bottom-6 left-0 right-0 text-center font-mono text-[10px] tracking-[0.25em]"
          style={{ color: "rgba(0,0,0,0.35)" }}
        >
          www.trak-archive.com
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Trigger hero entrance
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      // Only track the first 60% of scroll for card animation
      const raw = scrollTop / (scrollHeight * 0.6);
      setProgress(Math.min(1, raw));
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-screen overflow-y-scroll"
      style={{ backgroundColor: "#f0ede8" }}
    >
      {/* ── Sticky envelope scene ─────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center">
        {/* Nav */}
        <nav
          className="absolute left-0 right-0 top-0 flex items-center justify-between px-10 py-7"
          style={{ zIndex: 20 }}
        >
          <span
            className="text-[15px] font-black tracking-[0.3em]"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: "#1a1a1a",
            }}
          >
            TRAK
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-[13px] tracking-wide"
              style={{ color: "rgba(0,0,0,0.5)" }}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#1a1a1a] px-5 py-2 text-[13px] font-semibold tracking-wide text-white transition-opacity hover:opacity-80"
            >
              시작하기
            </Link>
          </div>
        </nav>

        {/* Hero copy — fades out as scroll progresses */}
        <div
          className="absolute left-10 top-1/2 -translate-y-1/2"
          style={{
            opacity: heroVisible ? Math.max(0, 1 - progress * 3) : 0,
            transform: `translateY(calc(-50% - ${progress * 20}px))`,
            transition: heroVisible ? "opacity 0.1s, transform 0.1s" : "opacity 0.8s ease",
            pointerEvents: "none",
          }}
        >
          <p
            className="mb-3 font-mono text-[11px] tracking-[0.3em]"
            style={{ color: "rgba(0,0,0,0.4)" }}
          >
            TRAVEL ARCHIVE
          </p>
          <h1
            className="text-[52px] font-black leading-[1.05] tracking-[-0.03em]"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: "#1a1a1a",
            }}
          >
            당신의 여행을
            <br />
            <span style={{ color: "var(--color-primary)" }}>아카이브</span>하세요.
          </h1>
          <p
            className="mt-4 max-w-[260px] text-[14px] leading-relaxed"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            스크롤을 내려 TRAK을 만나보세요
          </p>
          {/* Scroll hint arrow */}
          <div
            className="mt-8 flex flex-col items-start gap-1"
            style={{ color: "rgba(0,0,0,0.3)" }}
          >
            <div className="h-12 w-[1px] bg-current" />
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1L6 7L11 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Envelope with cards */}
        <div
          className="relative"
          style={{
            transform: `translateX(${progress > 0.05 ? "60px" : "120px"}) translateY(${progress * -20}px)`,
            transition: "transform 0.3s ease",
          }}
        >
          <Envelope>
            {CARDS.map((card, i) => (
              <ArchiveCard
                key={card.id}
                card={card}
                progress={progress}
                index={i}
                total={CARDS.length}
              />
            ))}
          </Envelope>
        </div>

        {/* Card label — shows which card is most visible */}
        <div
          className="absolute bottom-14 right-10 text-right"
          style={{
            opacity: progress > 0.1 ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        >
          {CARDS.map((card, i) => {
            const cardStart = i / CARDS.length;
            const cardEnd = (i + 1) / CARDS.length;
            const isActive = progress >= cardStart && progress < cardEnd;
            return (
              <p
                key={card.id}
                className="font-mono text-[10px] tracking-widest transition-all duration-300"
                style={{
                  color: isActive ? "#1a1a1a" : "rgba(0,0,0,0.2)",
                  fontWeight: isActive ? 700 : 400,
                  marginBottom: "2px",
                }}
              >
                {card.label.split(" / ")[1].toUpperCase()}
              </p>
            );
          })}
        </div>
      </div>

      {/* ── Scroll spacer (drives the animation) ─────────────────────── */}
      <div className="h-[400vh]" />

      {/* ── CTA section ───────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {/* Decorative stamp */}
        <div
          className="mb-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#BAE8E8]"
          style={{ opacity: 0.6 }}
        >
          <span
            className="text-[10px] font-black tracking-[0.2em] text-[#BAE8E8]"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            TRAK
          </span>
        </div>

        <p
          className="mb-4 font-mono text-[11px] tracking-[0.3em]"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          START YOUR ARCHIVE
        </p>
        <h2
          className="mb-6 text-[40px] font-black leading-tight tracking-tight text-white"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          첫 번째 여행을
          <br />
          <span style={{ color: "var(--color-primary)" }}>지금 기록하세요.</span>
        </h2>
        <p
          className="mb-12 max-w-[320px] text-[14px] leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          무료로 무제한 여행을 기록할 수 있습니다.
          <br />
          SNS가 아닌, 나만의 공간에서.
        </p>

        <Link
          href="/signup"
          className="group relative overflow-hidden rounded-full bg-primary px-10 py-4 text-[14px] font-bold tracking-wide text-[#1a1a1a] transition-all hover:bg-white"
        >
          무료로 시작하기
        </Link>

        {/* Bottom footer */}
        <div
          className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-8"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          <span className="text-[11px] tracking-widest">TERMS</span>
          <span className="text-[11px] tracking-widest">BLOG</span>
          <span className="text-[11px] tracking-widest">CONTACT</span>
          <span className="text-[11px] tracking-widest">©2026 TRAK</span>
        </div>
      </section>
    </div>
  );
}
