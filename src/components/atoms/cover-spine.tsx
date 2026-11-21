export function CoverSpine() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-4.5 rounded-l-[inherit] bg-[linear-gradient(to_right,rgb(0_0_0/0.22),rgb(0_0_0/0.06)_40%,transparent)] md:w-6"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-4.5 w-0.75 bg-[linear-gradient(to_right,rgb(0_0_0/0.22),rgb(255_255_255/0.1))] md:left-6"
      />
    </>
  );
}
