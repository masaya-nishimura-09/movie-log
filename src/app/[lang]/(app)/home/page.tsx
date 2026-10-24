import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.home.heading };
}

export default async function HomePage() {
  const dict = await getDictionary();

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-5 pb-7 md:px-7 md:pt-6">
      <h1 className="font-bold text-2xl text-foreground">
        {dict.home.heading}
      </h1>
    </div>
  );
}
