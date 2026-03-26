export default function ProductFeatures({ features = [], features_ar = [], isAr = false }) {
  const list = isAr && features_ar?.length > 0 ? features_ar : features
  if (!list || list.length === 0) return null

  const heading = isAr ? "المميزات" : "Features"

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{heading}</h2>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-4">
        <ul className="list-disc ps-5 space-y-2 text-sm text-gray-800">
          {list.map((feature, i) => (
            <li key={`${feature}-${i}`}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
