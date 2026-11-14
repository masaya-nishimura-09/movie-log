"use client";

import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { ImageDialog } from "@/components/organisms/image-dialog";

const tmdbSizePattern = /^https:\/\/image\.tmdb\.org\/t\/p\/w\d+\//;

type PosterViewerProps = {
  posterUrl: string;
  title: string;
  openLabel: string;
  closeLabel: string;
  children: ReactNode;
};

export function PosterViewer({
  posterUrl,
  title,
  openLabel,
  closeLabel,
  children,
}: PosterViewerProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={openLabel}
        className="block w-full cursor-zoom-in rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </button>
      <ImageDialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        closeLabel={closeLabel}
        finalFocus={trigger}
      >
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 md:px-24 md:pb-12">
          <Image
            src={posterUrl.replace(
              tmdbSizePattern,
              "https://image.tmdb.org/t/p/w780/",
            )}
            alt=""
            width={1000}
            height={1500}
            unoptimized
            sizes="100vw"
            draggable={false}
            className="h-auto max-h-full w-auto max-w-full select-none rounded-lg object-contain shadow-[0_24px_60px_-20px_rgb(0_0_0/0.6)]"
          />
        </div>
      </ImageDialog>
    </>
  );
}
