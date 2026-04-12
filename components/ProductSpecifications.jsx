export default function ProductSpecifications({ specifications = [], isAr = false }) {
  if (!specifications || specifications.length === 0) return null

  const heading = isAr ? "المواصفات" : "Specifications"

  return (
    <div className="mt-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{heading}</h2>

      <div className="border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
        {specifications.map((spec, i) => (
          <div
            key={`${spec.name}-${i}`}
            className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors duration-150 ${
              i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/60 dark:bg-gray-800/40"
            }`}
          >
            <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
              {isAr && spec.name_ar ? spec.name_ar : spec.name}
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {isAr && spec.value_ar ? spec.value_ar : spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
