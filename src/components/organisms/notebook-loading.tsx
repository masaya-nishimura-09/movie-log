import { InkLoading } from "@/components/molecules/ink-loading";
import { LogoPage } from "@/components/molecules/logo-page";
import { NotebookPage } from "@/components/molecules/notebook-page";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";

export function PageLoading() {
  return (
    <div className="flex h-full min-h-60 items-center justify-center">
      <InkLoading />
    </div>
  );
}

export function NotebookLoading() {
  return (
    <NotebookScreen
      toolbar={<div className="h-11 lg:h-10" />}
      footer={<div aria-hidden className="h-17.5 lg:hidden" />}
    >
      <RingNotebook variant="spread" className="hidden lg:flex">
        <LogoPage className="flex-1 basis-0" />
        <NotebookPage side="right">
          <PageLoading />
        </NotebookPage>
      </RingNotebook>
      <RingNotebook variant="single" className="h-full lg:hidden">
        <NotebookPage side="single">
          <PageLoading />
        </NotebookPage>
      </RingNotebook>
    </NotebookScreen>
  );
}
