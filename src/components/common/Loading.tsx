interface LoadingProps {
  className?: string;
  label?: string;
}

const FOLDERS = [
  { delay: "-3.85s", opacity: "opacity-20" },
  { delay: "-3.3s", opacity: "opacity-25" },
  { delay: "-2.75s", opacity: "opacity-35" },
  { delay: "-2.2s", opacity: "opacity-45" },
  { delay: "-1.65s", opacity: "opacity-55" },
  { delay: "-1.1s", opacity: "opacity-45" },
  { delay: "-0.55s", opacity: "opacity-35" },
  { delay: "0s", opacity: "opacity-25" },
];

function FolderGlyph({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-full w-full bg-[url('/folder-loading.png')] bg-contain bg-center bg-no-repeat ${className}`}
    />
  );
}

function FolderStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      {FOLDERS.map(({ delay, opacity }, index) => (
        <div
          key={index}
          className={`absolute left-1/2 top-1/2 flex h-[42px] w-[52px] animate-[trak-folder-pass_4s_linear_infinite] items-center justify-center will-change-transform motion-reduce:animate-none ${opacity}`}
          style={{ animationDelay: delay }}
        >
          <FolderGlyph />
        </div>
      ))}
    </div>
  );
}

export default function Loading({ className = "", label = "로딩 중" }: LoadingProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`w-full min-h-screen flex items-center justify-center bg-background ${className}`}
    >
      <div
        className="relative flex h-[150px] w-[min(560px,calc(100vw-48px))] items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <FolderStrip />

        <div className="relative z-10 h-[100px] w-[100px] rounded-full border-[10px] border-gray-200 bg-[#D9D9D9]">
          <div className="absolute inset-[10px] overflow-hidden rounded-full bg-[#D9D9D9]">
            <FolderStrip className="scale-[1.18]" />
          </div>
          <div className="absolute left-[73px] top-[73px] h-[52px] w-[8px] origin-top rotate-[-45deg] rounded-full bg-gray-200" />
        </div>
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
