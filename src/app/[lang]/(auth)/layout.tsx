export default function AuthLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="w-full max-w-111 rounded-[20px] border bg-card px-6 py-8 shadow-[0_18px_40px_-30px_rgb(10_41_71/0.35)] md:px-8">
        {children}
      </div>
    </main>
  );
}
