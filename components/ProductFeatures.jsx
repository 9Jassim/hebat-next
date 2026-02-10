export default function ProductFeatures({ features = [] }) {
  if (!features || features.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Features</h2>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm p-4">
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
          {features.map((feature, i) => (
            <li key={`${feature}-${i}`}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
