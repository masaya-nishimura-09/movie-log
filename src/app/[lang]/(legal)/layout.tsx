export default function LegalLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <main className="shell flex flex-1 items-start justify-center bg-sidebar px-4 py-10">
      <div className="shell-inset w-full max-w-3xl rounded-[20px] bg-card px-6 py-8 md:px-10">
        {children}
      </div>
    </main>
  );
}
