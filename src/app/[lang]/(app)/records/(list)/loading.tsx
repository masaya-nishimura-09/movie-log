import { NotebookPage } from "@/components/molecules/notebook-page";
import { NotebookScreen } from "@/components/organisms/notebook-screen";
import { RingNotebook } from "@/components/organisms/ring-notebook";

export default function Loading() {
  return (
    <NotebookScreen toolbar={<div className="h-11 lg:h-10" />}>
      <RingNotebook variant="spread" className="hidden lg:flex">
        <NotebookPage side="left" />
        <NotebookPage side="right" />
      </RingNotebook>
      <RingNotebook variant="single" className="h-full lg:hidden">
        <NotebookPage side="single" />
      </RingNotebook>
    </NotebookScreen>
  );
}
