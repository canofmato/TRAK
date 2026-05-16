"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Card {
  id: number;
  label: string;
  title: string;
  body: string;
  accent: string;
  textColor: string;
  tiltDeg: number;
  tag: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CARDS: Card[] = [
  {
    id: 1,
    label: "01 — ARCHIVE",
    title: "여행을\n데이터로.",
    body: "SNS 타임라인에 묻히는 기억 말고,\n내가 직접 꺼내볼 수 있는 아카이브.",
    accent: "var(--color-amber)",
    textColor: "#1a1a1a",
    tiltDeg: -4,
    tag: "PRIVATE ARCHIVE",
  },
  {
    id: 2,
    label: "02 — STRUCTURE",
    title: "Trip →\nFolder →\nPhoto.",
    body: "여행 단위로 독립된 공간.\n폴더로 순간을 분류하고\n사진마다 감정을 기록하세요.",
    accent: "#1e1e1e",
    textColor: "#f0ede8",
    tiltDeg: 3,
    tag: "ORGANIZED",
  },
  {
    id: 3,
    label: "03 — MAP",
    title: "발자취를\n지도 위에.",
    body: "다녀온 모든 여행지가\n지도 위 하나의 점으로 남습니다.\n당신만의 세계 지도.",
    accent: "var(--color-lime)",
    textColor: "#1a1a1a",
    tiltDeg: -2,
    tag: "VISUAL TRAIL",
  },
  {
    id: 4,
    label: "04 — YOURS",
    title: "오직\n나만의\n기록.",
    body: "좋아요도, 팔로워도 없습니다.\n보여주기 위한 게 아닌\n나를 위한 디지털 일기장.",
    accent: "var(--color-rose)",
    textColor: "#1a1a1a",
    tiltDeg: 2,
    tag: "NO AUDIENCE",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const SCROLL_PER_CARD_VH = 50;
const CARD_W = 300;
const CARD_H = 380;
const ENV_W = 340;
const ENV_H = 220;

// ─── Single Card ─────────────────────────────────────────────────────────────

function ArchiveCard({
  card,
  state,
  riseProgress,
}: {
  card: Card;
  state: "hidden" | "rising" | "shown" | "gone";
  riseProgress: number;
}) {
  const isDark = card.accent === "#1e1e1e";

  let translateY = 0;
  let translateX = 0;
  let opacity = 1;
  let scale = 1;

  if (state === "hidden") {
    translateY = CARD_H + 80;
    opacity = 0;
  } else if (state === "rising") {
    const eased = 1 - Math.pow(1 - riseProgress, 3);
    translateY = (CARD_H + 80) * (1 - eased);
    opacity = Math.min(1, riseProgress * 2);
  } else if (state === "shown") {
    translateY = 0;
    opacity = 1;
  } else {
    // gone — slide left and shrink
    translateX = -72;
    translateY = 12;
    opacity = 0;
    scale = 0.94;
  }

  return (
    <div
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        left: "50%",
        bottom: ENV_H - 24,
        marginLeft: -CARD_W / 2,
        transform: `translateY(${translateY}px) translateX(${translateX}px) rotate(${card.tiltDeg}deg) scale(${scale})`,
        opacity,
        transition:
          state === "gone"
            ? "transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease"
            : "none",
        transformOrigin: "center bottom",
        borderRadius: 16,
        backgroundColor: card.accent,
        boxShadow: isDark
          ? "0 16px 56px rgba(0,0,0,0.35)"
          : "0 12px 48px rgba(0,0,0,0.13)",
        padding: "28px 28px 40px",
        boxSizing: "border-box" as const,
        zIndex: 5,
        willChange: "transform, opacity",
      }}
    >
      {/* Tag pill */}
      <span
        style={{
          display: "inline-block",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.13)"}`,
          borderRadius: 999,
          padding: "3px 10px",
          fontSize: 9,
          letterSpacing: "0.2em",
          fontWeight: 600,
          color: card.textColor,
          opacity: 0.65,
          marginBottom: 18,
          fontFamily: "monospace",
        }}
      >
        {card.tag}
      </span>

      {/* Index label */}
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: card.textColor,
          opacity: 0.38,
          marginBottom: 10,
        }}
      >
        {card.label}
      </p>

      {/* Title */}
      <h2
        style={{
          fontSize: 30,
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: card.textColor,
          whiteSpace: "pre-line",
          marginBottom: 18,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        {card.title}
      </h2>

      {/* Rule */}
      <div
        style={{
          width: 28,
          height: 1,
          backgroundColor: card.textColor,
          opacity: 0.18,
          marginBottom: 14,
        }}
      />

      {/* Body */}
      <p
        style={{
          fontSize: 12,
          lineHeight: 1.75,
          color: card.textColor,
          opacity: 0.52,
          whiteSpace: "pre-line",
        }}
      >
        {card.body}
      </p>

      {/* Corner stamp */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: "0.15em",
          color: card.textColor,
          opacity: 0.3,
          fontFamily: "monospace",
        }}
      >
        TRAK
      </div>
    </div>
  );
}

// ─── Envelope ─────────────────────────────────────────────────────────────────

function Envelope() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        marginLeft: -ENV_W / 2,
        width: ENV_W,
        height: ENV_H,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "var(--color-primary)" ,
          borderRadius: "4px 4px 18px 18px",
          overflow: "hidden",
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox={`0 0 ${ENV_W} ${ENV_H}`}
          preserveAspectRatio="none"
        >
          {/* V-fold lines */}
          <line x1="0" y1="0" x2={ENV_W / 2} y2={ENV_H * 0.44} stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
          <line x1={ENV_W} y1="0" x2={ENV_W / 2} y2={ENV_H * 0.44} stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
          {/* Bottom triangle shadow */}
          <polygon
            points={`0,${ENV_H} ${ENV_W / 2},${ENV_H * 0.56} ${ENV_W},${ENV_H}`}
            fill="rgba(0,0,0,0.04)"
          />
        </svg>

        <p
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "monospace",
            fontSize: 9,
            letterSpacing: "0.24em",
            color: "rgba(0,0,0,0.28)",
          }}
        >
          WWW.TRAK-ARCHIVE.COM
        </p>
      </div>

      {/* Top edge shadow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPx, setScrollPx] = useState(0);
  const [viewH, setViewH] = useState(800);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    const updateHeight = () => setViewH(window.innerHeight);
  updateHeight();

  // 리사이즈 대응도 같이
  window.addEventListener("resize", updateHeight);
  return () => window.removeEventListener("resize", updateHeight);
}, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollPx(el.scrollTop);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Animation math
  const pxPerCard = (SCROLL_PER_CARD_VH / 100) * viewH;
  const animStart = viewH * 0.12;
  const animPx = Math.max(0, scrollPx - animStart);
  const rawCardIndex = animPx / pxPerCard;
  const clampedRaw = Math.min(rawCardIndex, CARDS.length - 0.001);
  const activeCardIndex = Math.floor(clampedRaw);
  const riseProgress = Math.min(1, clampedRaw - activeCardIndex);

  // Hero fade
  const heroOpacity = heroIn ? Math.max(0, 1 - scrollPx / (viewH * 0.2)) : 0;

  // Scene center shift: once hero fades, envelope centers
  const sceneMarginLeft = heroOpacity > 0.05 ? 110 : 0;

  // Outro: 카드 다 나온 후 씬 전체가 위로 올라가며 사라짐
  const outroStart = animStart + CARDS.length * pxPerCard;
  const outroDuration = viewH * 0.3;
  const outroProgress = Math.max(0, Math.min(1, (scrollPx - outroStart) / outroDuration));
  const outroEased = outroProgress < 0.5
    ? 2 * outroProgress * outroProgress
    : 1 - Math.pow(-2 * outroProgress + 2, 2) / 2; // easeInOutQuad

  const sceneTranslateY = outroEased * -viewH * 0.35;
  const sceneOpacity = 1 - outroEased;

  const totalScrollH = animStart + CARDS.length * pxPerCard + outroDuration;

  return (
    <div
      ref={scrollRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        backgroundColor: "var(--color-gray-100)",
      }}
    >
      {/* ── Sticky scene ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transform: `translateY(${sceneTranslateY}px)`,
          opacity: sceneOpacity,
          pointerEvents: outroProgress > 0.5 ? "none" : "auto",
        }}
      >
        {/* Nav */}
        <nav
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 40px",
            zIndex: 30,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "0.3em",
              color: "var(--color-black)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            TRAK
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Link
              href="/login"
              style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", letterSpacing: "0.04em" }}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.04em",
                backgroundColor: "var(--color-black)",
                color: "#fff",
                borderRadius: 999,
                padding: "8px 20px",
              }}
            >
              시작하기
            </Link>
          </div>
        </nav>

        {/* Hero copy (left side, fades on scroll) */}
        <div
          style={{
            position: "absolute",
            left: 48,
            top: "50%",
            transform: `translateY(calc(-50% - ${scrollPx * 0.22}px))`,
            opacity: heroOpacity,
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.32em",
              color: "rgba(0,0,0,0.35)",
              marginBottom: 14,
            }}
          >
            TRAVEL ARCHIVE
          </p>
          <h1
            style={{
              fontSize: 50,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-black)",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            당신의 여행을
            <br />
            <span style={{ color: "var(--color-primary)"  }}>아카이브</span>하세요.
          </h1>
          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: "rgba(0,0,0,0.38)",
              lineHeight: 1.65,
            }}
          >
            스크롤을 내려 TRAK을 만나보세요
          </p>
          <div
            style={{
              marginTop: 28,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 4,
              color: "rgba(0,0,0,0.22)",
            }}
          >
            <div style={{ width: 1, height: 44, backgroundColor: "currentColor" }} />
            <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
              <path d="M1 1L5 6L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Envelope + cards */}
        <div
          style={{
            position: "relative",
            width: ENV_W,
            height: ENV_H + CARD_H + 20,
            marginLeft: sceneMarginLeft,
            transition: "margin-left 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Render all cards; z-index handled by state */}
          {CARDS.map((card, i) => {
            let state: "hidden" | "rising" | "shown" | "gone";
            if (i < activeCardIndex) state = "gone";
            else if (i === activeCardIndex) state = "rising";
            else state = "hidden";

            return (
              <ArchiveCard
                key={card.id}
                card={card}
                state={state}
                riseProgress={riseProgress}
              />
            );
          })}

          <Envelope />
        </div>

        {/* Progress indicator — right side */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 44,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
            opacity: scrollPx > 60 ? 1 : 0,
            transition: "opacity 0.5s",
            zIndex: 20,
          }}
        >
          {CARDS.map((card, i) => {
            const isActive = i === activeCardIndex;
            const isDone = i < activeCardIndex;
            return (
              <div
                key={card.id}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: isActive ? "var(--color-black)" : "rgba(0,0,0,0.2)",
                    fontWeight: isActive ? 700 : 400,
                    transition: "color 0.3s",
                  }}
                >
                  {card.tag}
                </span>
                <div
                  style={{
                    width: isActive ? 22 : 6,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: isActive
                      ? "var(--color-black)"
                      : isDone
                      ? "rgba(0,0,0,0.22)"
                      : "rgba(0,0,0,0.08)",
                    transition: "all 0.3s",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scroll spacer ────────────────────────────────────────────── */}
      <div style={{ height: totalScrollH }} />

      {/* ── CTA section ──────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-black)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
          position: "relative",
          // 씬이 사라지는 속도에 맞춰 CTA가 자연스럽게 등장
          opacity: Math.min(1, outroProgress * 3),
          transform: `translateY(${(1 - Math.min(1, outroProgress * 2.5)) * 40}px)`,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: "1.5px solid rgba(186,232,232,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 7,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "var(--color-primary)" ,
              fontFamily: "monospace",
              opacity: 0.7,
            }}
          >
            TRAK
          </span>
        </div>

        <p
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.32em",
            color: "rgba(255,255,255,0.28)",
            marginBottom: 16,
          }}
        >
          START YOUR ARCHIVE
        </p>

        <h2
          style={{
            fontSize: 38,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "#fff",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            marginBottom: 20,
          }}
        >
          첫 번째 여행을
          <br />
          <span style={{ color: "var(--color-primary)" }}>지금 기록하세요.</span>
        </h2>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.38)",
            maxWidth: 300,
            marginBottom: 48,
          }}
        >
          무료로 무제한 여행을 기록할 수 있습니다.
          <br />
          SNS가 아닌, 나만의 공간에서.
        </p>

        <Link
          href="/signup"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "#1a1a1a",
            borderRadius: 999,
            padding: "14px 40px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          무료로 시작하기
        </Link>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {["TERMS", "BLOG", "CONTACT", "©2026 TRAK"].map((item) => (
            <span
              key={item}
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(255,255,255,0.16)",
                fontFamily: "monospace",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
