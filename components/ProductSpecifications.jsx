export default function ProductSpecifications({ specifications = [], isAr = false }) {
  if (!specifications || specifications.length === 0) return null

  const heading = isAr ? "المواصفات" : "Specifications"

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{heading}</h2>

      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {specifications.map((spec, i) => (
          <div
            key={`${spec.name}-${i}`}
            className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${
              i !== specifications.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <span className="font-medium text-gray-800">
              {isAr && spec.name_ar ? spec.name_ar : spec.name}
            </span>
            <span className="text-gray-700">
              {isAr && spec.value_ar ? spec.value_ar : spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
