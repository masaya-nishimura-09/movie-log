import { cPath, playPath, stampPath } from "@/components/atoms/logo-paths";

type StampShapesProps = {
  stampClassName: string;
  cClassName: string;
  playClassName: string;
};

export function StampShapes({
  stampClassName,
  cClassName,
  playClassName,
}: StampShapesProps) {
  return (
    <>
      <path d={stampPath} className={stampClassName} />
      <path d={cPath} className={cClassName} />
      <circle cx="71.385" cy="39.573" r="4.5" className={cClassName} />
      <circle cx="71.385" cy="70.427" r="4.5" className={cClassName} />
      <path d={playPath} className={playClassName} />
    </>
  );
}
