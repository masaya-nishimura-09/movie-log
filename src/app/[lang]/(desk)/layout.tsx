export default function DeskLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-8 md:py-12">
      {children}
    </main>
  );
}
