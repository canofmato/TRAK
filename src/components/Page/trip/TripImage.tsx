import Image from "next/image";

interface TripImageProps {
  src: string | null;
  alt: string;
};

export default function TripImage({ src, alt }: TripImageProps) {
  return (
    <div className="relative w-full min-h-[360px] lg:h-[470px] lg:max-h-[470px] border border-light bg-gray-200 flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out">
      {src ? (
        <Image 
          src={src} 
          alt={alt}
          fill
          className="object-cover transition-opacity duration-300" 
          sizes="(max-width: 1024px) 100vw, 40vw" // 반응형에 맞춰 최적화된 용량의 이미지를 다운받도록 힌트 제공
        />
      ) : (
        <span className="text-body font-bold text-center">MAIN <br />IMAGE</span>
      )}
    </div>
  )
}