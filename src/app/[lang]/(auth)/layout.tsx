export default function AuthLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <main className="shell flex flex-1 items-center justify-center bg-sidebar px-4 py-10">
      <div className="shell-inset w-full max-w-111 rounded-[20px] bg-card px-6 py-8 md:px-8">
        {children}
      </div>
    </main>
  );
}
