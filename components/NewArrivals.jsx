"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

const T = {
  en: {
    label: "Just Landed",
    heading: "New Arrivals",
    subtext: "The freshest additions to the Hebat lineup — be the first to explore them.",
    view: "View product",
    latest: "Latest drop",
  },
  ar: {
    label: "وصل حديثاً",
    heading: "أحدث المنتجات",
    subtext: "أحدث الإضافات إلى تشكيلة هيبات — كن أول من يكتشفها.",
    view: "عرض المنتج",
    latest: "أحدث وصول",
  },
}

const AUTO_MS = 5000

export default function NewArrivals({ products = [], isAr = false, heading, buildHref }) {
  const t = T[isAr ? "ar" : "en"]
  const list = products.slice(0, 8)

  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(1)
  const paused = useRef(false)

  // Reset when the product set changes
  useEffect(() => {
    setActive(0)
  }, [products])

  // Auto-advance
  useEffect(() => {
    if (list.length < 2) return
    const id = setInterval(() => {
      if (paused.current) return
      setDir(1)
      setActive(prev => (prev + 1) % list.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [list.length])

  if (!list.length) return null

  const goTo = i => {
    setDir(i > active ? 1 : -1)
    setActive(i)
  }

  const current = list[active]
  const name = isAr && current?.name_ar ? current.name_ar : current?.name
  const title = heading || t.heading
  const href = buildHref ? buildHref(current) : "#"

  // Slide direction respects RTL reading direction
  const enterX = (isAr ? -1 : 1) * dir * 60

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      <section
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gray-950 ring-1 ring-white/[0.06]"
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
      >
        {/* ── Ambient background ── */}
        <div className="pointer-events-none absolute inset-0">
          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          {/* moving glow follows active product */}
          <motion.div
            key={`glow-${active}`}
            initial={{ opacity: 0.35 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
            className="absolute top-1/2 ltr:right-[18%] rtl:left-[18%] -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-yellow-400/25 blur-[90px]"
          />
          <div className="absolute -top-16 ltr:-left-16 rtl:-right-16 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-4 p-6 sm:p-10 lg:p-12">
          {/* ── Left: copy ── */}
          <div className="flex flex-col justify-between gap-8 lg:py-4 z-10">
            <div className="flex flex-col gap-5">
              {/* eyebrow */}
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3.5 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">
                  {t.label}
                </span>
              </div>

              <div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95] text-white">
                  {title}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <span className="h-1 w-12 rounded-full bg-yellow-500" />
                  <span className="h-1 w-4 rounded-full bg-yellow-500/30" />
                </div>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-white/50">{t.subtext}</p>
            </div>

            {/* Active product meta — animates with the spotlight */}
            <div className="min-h-[128px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`meta-${active}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-3"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                    {t.latest} · {String(active + 1).padStart(2, "0")}
                  </span>
                  <Link
                    href={href}
                    className="group/name inline-flex items-start gap-2 text-2xl font-black leading-tight text-white transition-colors hover:text-yellow-400"
                  >
                    <span className="line-clamp-2">{name}</span>
                  </Link>
                  {current?.model && (
                    <p className="font-mono text-xs text-white/35">{current.model}</p>
                  )}
                  <Link
                    href={href}
                    className="group/cta mt-1 inline-flex items-center gap-2 self-start rounded-2xl bg-yellow-500 px-6 py-3 text-sm font-black text-black shadow-lg shadow-yellow-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-400"
                  >
                    {t.view}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover/cta:translate-x-1 rtl:group-hover/cta:-translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: spotlight stage ── */}
          <div className="relative z-10 flex flex-col gap-5">
            <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[360px]">
              {/* giant index numeral behind */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={`num-${active}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.07, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13rem] sm:text-[17rem] font-black leading-none text-white select-none"
                >
                  {String(active + 1).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>

              {/* NEW badge */}
              <span className="absolute top-0 ltr:right-2 rtl:left-2 z-20 rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-yellow-500/40">
                {isAr ? "جديد" : "New"}
              </span>

              {/* product image */}
              <AnimatePresence mode="wait" custom={enterX}>
                <motion.div
                  key={`img-${active}`}
                  custom={enterX}
                  initial={{ opacity: 0, x: enterX, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -enterX, scale: 0.96 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full max-w-[340px]"
                >
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Link href={href}>
                      <img
                        src={current?.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                        alt={name}
                        className="mx-auto max-h-[320px] w-auto object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
                      />
                    </Link>
                  </motion.div>
                  {/* pedestal reflection */}
                  <div className="mx-auto mt-2 h-6 w-3/4 rounded-[100%] bg-yellow-500/20 blur-xl" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* thumbnail rail */}
            {list.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {list.map((prod, i) => {
                  const isActive = i === active
                  return (
                    <button
                      key={prod._id || prod.slug || i}
                      onClick={() => goTo(i)}
                      aria-label={prod?.name}
                      className={`group relative flex-shrink-0 rounded-xl border p-1.5 transition-all duration-300 ${
                        isActive
                          ? "border-yellow-500 bg-white/[0.06]"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg bg-white/5 flex items-center justify-center">
                        <img
                          src={prod?.images?.[0]?.s3Url || "/hebat_product_fill.png"}
                          alt=""
                          className={`h-full w-full object-contain p-1 transition-opacity ${
                            isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                          }`}
                        />
                      </div>
                      {/* auto-advance progress on the active thumb */}
                      {isActive && (
                        <motion.span
                          key={`prog-${active}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                          className="absolute inset-x-1.5 bottom-1 h-0.5 origin-[left] rtl:origin-[right] rounded-full bg-yellow-500"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
