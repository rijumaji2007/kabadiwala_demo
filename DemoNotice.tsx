type DemoNoticeProps = {
  children: React.ReactNode;
};

export function DemoNotice({ children }: DemoNoticeProps) {
  return (
    <aside className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <span aria-hidden="true" className="pt-0.5 text-lg">
        ℹ️
      </span>
      <p className="leading-6">{children}</p>
    </aside>
  );
}
