import type { WasteCategory } from "@/types/customer";

type WasteCategoryCardProps = {
  category: WasteCategory;
  selected?: boolean;
  onSelect?: (categoryId: string) => void;
};

export function WasteCategoryCard({
  category,
  selected = false,
  onSelect
}: WasteCategoryCardProps) {
  return (
    <button
      aria-pressed={selected}
      className={
        "group flex min-h-40 w-full flex-col rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-forest-200 " +
        (selected
          ? "border-forest-600 bg-forest-50 shadow-sm"
          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-sm")
      }
      onClick={() => onSelect?.(category.id)}
      type="button"
    >
      <span className="text-3xl" aria-hidden="true">
        {category.icon}
      </span>
      <span className="mt-4 font-bold text-slate-900">{category.name}</span>
      <span className="mt-1 text-xs leading-5 text-slate-600">{category.description}</span>
      <span className="mt-auto pt-3 text-xs font-bold text-forest-700">
        {selected ? "Selected ✓" : "Select"}
      </span>
    </button>
  );
}
