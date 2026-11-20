import Image from "next/image";
import { MaskingTape } from "@/components/atoms/masking-tape";

type ScrapPhotoProps = {
  imageUrl: string;
  label: string;
  onOpen: () => void;
};

export function ScrapPhoto({ imageUrl, label, onOpen }: ScrapPhotoProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="relative block w-full cursor-zoom-in bg-white p-1.5 shadow-[0_5px_12px_rgb(10_41_71/0.15)] outline-none focus-visible:ring-2 focus-visible:ring-ring lg:p-1.75 lg:shadow-[0_6px_14px_rgb(10_41_71/0.16)]"
    >
      <span className="relative block aspect-5/7 overflow-hidden">
        <Image
          src={imageUrl}
          alt=""
          fill
          unoptimized
          sizes="160px"
          className="object-cover"
        />
      </span>
      <MaskingTape className="-top-2 h-4 w-12.5 lg:-top-2.5 lg:h-5.5 lg:w-16" />
    </button>
  );
}
