export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 skeleton rounded" />
          <div className="h-4 w-12 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
