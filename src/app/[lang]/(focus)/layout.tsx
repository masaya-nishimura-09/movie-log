export default function FocusLayout({ children }: LayoutProps<"/[lang]">) {
  return <div className="flex flex-1 flex-col">{children}</div>;
}
