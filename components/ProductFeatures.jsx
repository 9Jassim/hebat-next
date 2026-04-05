export default function ProductFeatures({ features = [], features_ar = [], isAr = false }) {
  const list = isAr && features_ar?.length > 0 ? features_ar : features
  if (!list || list.length === 0) return null

  const heading = isAr ? "المميزات" : "Features"

  return (
    <div className="mt-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{heading}</h2>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        {list.map((feature, i) => (
          <div
            key={`${feature}-${i}`}
            className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
          >
            <svg
              className="mt-0.5 flex-shrink-0"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <circle cx="7.5" cy="7.5" r="7.5" fill="rgba(252,187,23,0.15)" />
              <path
                d="M4.5 7.5L6.5 9.5L10.5 5.5"
                stroke="#fcbb17"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
