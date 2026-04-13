"use client"

import toast from "react-hot-toast"
import { useState } from "react"
import Link from "next/link"
import Client from "@/lib/api"
import { useLanguage } from "@/context/LanguageContext"
import { ArrowRight, Send } from "lucide-react"

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/morslon.bh",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.6 2.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@morslon_bh",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965A30.146 30.146 0 0 0 2.1 11.243v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206ZM10.008 14.591v-5.62l5.4 2.819-5.4 2.801Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@morslon.bh",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.438 2.017C13.53 2 14.613 2.008 15.696 2c.067 1.275.525 2.575 1.459 3.475c.933.925 2.25 1.35 3.533 1.492v3.358c-1.2-.042-2.408-.292-3.5-.808c-.475-.217-.917-.492-1.35-.775c-.008 2.433.008 4.866-.017 7.291a6.36 6.36 0 0 1-1.125 3.283c-1.091 1.6-2.983 2.642-4.924 2.675c-1.192.067-2.384-.258-3.4-.858c-1.684-.992-2.867-2.808-3.042-4.758a16 16 0 0 1-.008-1.242c.15-1.583.933-3.1 2.15-4.133c1.383-1.2 3.316-1.775 5.125-1.433c.016 1.233-.034 2.466-.034 3.7c-.825-.267-1.791-.192-2.516.308a2.9 2.9 0 0 0-1.134 1.458c-.175.425-.125.892-.116 1.342c.2 1.366 1.516 2.516 2.916 2.392c.934-.009 1.825-.55 2.309-1.342c.158-.275.333-.559.341-.884c.084-1.491.05-2.975.059-4.466c.008-3.358-.009-6.708.016-10.058" />
      </svg>
    ),
  },
  {
    label: "Snapchat",
    href: "https://www.snapchat.com/add/morslon.bh",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.406 14.745c-.166-.45-.484-.689-.844-.882-.043-.024-.084-.044-.124-.063-.085-.043-.168-.085-.252-.13-.9-.478-1.604-1.083-2.095-1.797a4.259 4.259 0 0 1-.36-.635.43.43 0 0 1-.01-.248.45.45 0 0 1 .118-.138c.15-.1.303-.202.407-.27.187-.12.333-.215.429-.283.357-.25.607-.516.762-.813.25-.5.273-1.082.066-1.636-.242-.635-.842-1.03-1.567-1.03a2.112 2.112 0 0 0-.574.078 13.627 13.627 0 0 0-.041-1.336C16.875 3.2 16.29 2.36 15.65 1.63a5.029 5.029 0 0 0-1.29-1.038C13.197.21 12.13 0 10.999 0c-1.13 0-2.195.21-3.36.592a5.04 5.04 0 0 0-1.29 1.038C5.707 2.36 5.123 3.2 5.002 4.524a13.616 13.616 0 0 0-.04 1.336 2.12 2.12 0 0 0-.574-.078c-.725 0-1.325.395-1.567 1.03-.207.554-.185 1.137.066 1.637.155.297.405.562.762.812.096.068.242.163.43.283.104.068.257.17.406.27a.45.45 0 0 1 .118.139.43.43 0 0 1-.01.247 4.244 4.244 0 0 1-.36.636c-.491.714-1.195 1.319-2.095 1.796-.083.045-.167.087-.252.13a2.015 2.015 0 0 0-.124.063c-.36.193-.678.432-.844.883-.152.411-.052.877.247 1.272.14.184.306.338.487.452.333.209.693.357 1.072.458.142.037.284.07.427.1a.728.728 0 0 1 .263.118c.15.133.129.33.326.62.093.132.212.246.35.336.391.273.832.29 1.3.309.422.016.903.034 1.45.216.228.076.468.224.744.395.663.41 1.578.973 3.104.973 1.527 0 2.444-.563 3.105-.974.275-.17.516-.318.743-.394.547-.182 1.027-.2 1.45-.216.468-.019.909-.036 1.3-.309a1.1 1.1 0 0 0 .35-.336c.197-.29.176-.487.326-.62a.73.73 0 0 1 .263-.118c.143-.03.285-.063.427-.1a3.513 3.513 0 0 0 1.072-.458 1.605 1.605 0 0 0 .486-.452c.3-.395.4-.86.248-1.272Z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const { t, p, isAr } = useLanguage()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  const handleSubscribe = async e => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await Client.post("/newsletter", { email }, { withCredentials: true })
      if (res.status === 200 || res.status === 201) {
        toast.success("✅ You've successfully subscribed to our newsletter!")
        setEmail("")
        setStatus("success")
      } else {
        toast.error("Something went wrong. Please try again.")
        setStatus("error")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed. Try again later.")
      setStatus("error")
    } finally {
      setTimeout(() => setStatus(""), 4000)
    }
  }

  return (
    <footer className="bg-gray-950 text-white">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Col 1 — Brand + socials */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-6 rounded-full bg-yellow-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-yellow-500/80">
                  {isAr ? "هيبات" : "HEBAT"}
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                {isAr
                  ? "علامة تجارية موثوقة تقدم منتجات عالية الجودة لكل أسلوب حياة."
                  : "A trusted brand delivering quality products for every lifestyle."}
              </p>
            </div>

            <a
              href="https://wa.me/97366600457"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors w-fit"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.845L.057 23.885l6.215-1.44A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.001-1.373l-.36-.214-3.687.855.87-3.593-.234-.37A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              <span dir="ltr">+973 66600457</span>
            </a>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">
                {isAr ? "تابعنا" : "Follow us"}
              </p>
              <div className="flex gap-2">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2 — Links */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
              {isAr ? "روابط" : "Links"}
            </p>
            {[
              { href: p("/"), label: t("home") },
              { href: p("/products"), label: t("products") },
              { href: p("/about"), label: t("about") },
              { href: p("/contact"), label: t("contact") },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-200 w-fit"
              >
                <ArrowRight className="w-3 h-3 rtl:rotate-180 text-yellow-500/0 group-hover:text-yellow-500 -translate-x-1 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0 transition-all duration-200" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Newsletter */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
                {isAr ? "النشرة البريدية" : "Newsletter"}
              </p>
              <p className="text-sm text-white/50 mt-2 leading-relaxed">
                {isAr
                  ? "اشترك لتصلك آخر المنتجات والعروض."
                  : "Subscribe to get the latest products and offers."}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                placeholder={t("yourEmail")}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-yellow-500/50 focus:bg-white/8 text-white placeholder-white/30 text-sm rounded-xl px-4 py-2.5 outline-none transition-all duration-200"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="group flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm rounded-xl px-4 py-2.5 transition-all duration-200 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                {status === "loading" ? "..." : t("subscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="text-yellow-500 font-semibold">Hebat | هيبات</span>
            {isAr ? ". جميع الحقوق محفوظة." : ". All Rights Reserved."}
          </span>
          <a
            href="https://morslon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            morslon.com
          </a>
        </div>
      </div>
    </footer>
  )
}
