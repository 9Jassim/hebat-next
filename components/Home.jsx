"use client"

import Link from "next/link"
import Banners from "@/components/Banners"
import { useLanguage } from "@/context/LanguageContext"

const content = {
  en: {
    heading: "HEBAT",
    body: "Our products are selected for quality, variety, and customer satisfaction.\n\nWith a keen eye for detail, we ensure a delightful shopping experience that keeps you coming back.\n\nCustomer satisfaction is our top priority. We strive to provide the best products to meet your needs.\n\nVisit our shop website.",
    cta: "Visit Morslon",
  },
  ar: {
    heading: "هيبات",
    body: "منتجاتنا مختارة بعناية لتحقيق الجودة والتنوع ورضا العملاء.\n\nنحرص على تقديم تجربة تسوق ممتعة تجعلك تعود إلينا مراراً.\n\nرضا العميل هو أولويتنا القصوى، ونسعى دائماً لتقديم أفضل المنتجات التي تلبي احتياجاتك.\n\nزر موقع متجرنا الإلكتروني.",
    cta: "زيارة مورسلون",
  },
}

export default function Home() {
  const { locale, p } = useLanguage()
  const { heading, body, cta } = content[locale] || content.en

  return (
    <section className="relative overflow-hidden bg-gray-50 p-10">
      <div className="absolute end-0 top-0 w-full h-full ltr:bg-gradient-to-l rtl:bg-gradient-to-r from-yellow-50 via-white to-white -z-10"></div>

      <div className="w-full mb-16 lg:px-8">
        <div className="lg:mx-auto lg:max-w-7xl">
          <Banners />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-10 relative">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-x-20 items-center">
          {/* Text Section */}
          <div className="flex flex-col justify-center lg:pe-8">
            <div className="lg:max-w-lg">
              <p className="text-3xl font-bold tracking-tight text-yellow-500 sm:text-4xl">
                {heading}
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-800 whitespace-pre-line">{body}</p>

              <button
                onClick={() => window.open("https://morslon.com/", "_blank")}
                type="button"
                className="mt-6 text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center shadow-md"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 21"
                >
                  <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>
                {cta}
              </button>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex justify-center items-center relative mt-12 lg:mt-0">
            <Link
              href={p("/products")}
              className="relative block w-[90%] md:w-[34rem] lg:w-[38rem] transition-transform duration-500 ease-in-out hover:scale-105"
            >
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl -rotate-3 translate-x-3 translate-y-3 opacity-20"></div>
              <img
                src="/hebat_cover.png"
                alt="Hebat Product Showcase"
                className="relative w-full rounded-3xl shadow-2xl object-contain max-h-[28rem]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
