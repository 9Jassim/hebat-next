"use client"

import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

export default function About() {
  const { isAr, t, p } = useLanguage()

  return (
    <section className="pt-[50px] pb-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-6 text-center">
          {t("aboutTitle")} <span className="text-yellow-500">{isAr ? "هيبات" : "Hebat"}</span>
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center mb-12">
          {t("aboutIntro")}
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
            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">{t("ourMission")}</h2>
            <p className="text-gray-700 mb-6">{t("missionText")}</p>

            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">{t("ourValues")}</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>
                <strong>{t("qualityFirst")}</strong> {t("qualityFirstText")}
              </li>
              <li>
                <strong>{t("customerFocus")}</strong> {t("customerFocusText")}
              </li>
              <li>
                <strong>{t("innovation")}</strong> {t("innovationText")}
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">{t("ourPromise")}</h2>
            <p className="text-gray-700 mb-6">{t("promiseText")}</p>

            <Link
              href={p("/products")}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg px-6 py-3 transition-all shadow-md"
            >
              {t("exploreProducts")}
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t("aboutCta")}</h3>
          <Link
            href={p("/contact")}
            className="inline-block bg-black text-white hover:bg-yellow-500 hover:text-black transition-all px-6 py-3 rounded-lg font-medium"
          >
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  )
}
