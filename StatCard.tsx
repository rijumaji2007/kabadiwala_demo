type StatCardProps = {
  icon: string;
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ icon, label, value, detail }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-50 text-lg" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </article>
  );
}
