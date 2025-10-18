"use client"

import Link from "next/link"

export default function About() {
  return (
    <section className="pt-[50px] pb-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6 text-center">
          About <span className=" text-yellow-500">Hebat</span>
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
          Hebat is your trusted source for premium products and accessories across the Middle East.
          We take pride in offering quality, variety, and style — all designed to meet the modern
          customer’s needs with excellence and care.
        </p>

        {/* Two-column content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/hebat_cover.png"
              alt="Hebat Store"
              className="rounded-3xl shadow-2xl max-w-full md:max-w-lg object-contain"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              We believe every product you buy should bring you confidence and satisfaction. That’s
              why Hebat carefully curates each item — ensuring quality, durability, and innovation
              meet our customers’ expectations.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Our Values</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>
                <strong>Quality First:</strong> We only offer products that meet our high standards.
              </li>
              <li>
                <strong>Customer Focus:</strong> Every product and service is built around your
                needs.
              </li>
              <li>
                <strong>Innovation:</strong> We embrace modern solutions and forward-thinking
                design.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Our Promise</h2>
            <p className="text-gray-700 mb-6">
              Hebat is more than just a brand — it’s a commitment to excellence. Our team works
              tirelessly to ensure that your shopping experience is seamless, secure, and
              satisfying.
            </p>

            <Link
              href="/products"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg px-6 py-3 transition-all shadow-md"
            >
              Explore Our Products
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Have questions or want to partner with us?
          </h3>
          <Link
            href="/contact"
            className="inline-block bg-black text-white hover:bg-yellow-500 hover:text-black transition-all px-6 py-3 rounded-lg font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
