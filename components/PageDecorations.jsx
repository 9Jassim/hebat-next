/**
 * Subtle scattered background decorations — blobs, rings, rotated squares,
 * dots and short lines spread across the left, right and center of the page.
 * Always behind content (z-0, pointer-events-none).
 */
export default function PageDecorations() {
  return (
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden z-0 dark:opacity-30">
      {/* ── Soft glow blobs ── */}
      {/* left edge */}
      <div className="absolute left-[-4%] top-[8%]  w-56 h-56 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="absolute left-[-2%] top-[45%] w-48 h-48 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute left-[-3%] top-[78%] w-52 h-52 rounded-full bg-yellow-300/9  blur-3xl" />
      {/* right edge */}
      <div className="absolute right-[-4%] top-[18%] w-56 h-56 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="absolute right-[-2%] top-[55%] w-48 h-48 rounded-full bg-yellow-400/9  blur-3xl" />
      <div className="absolute right-[-3%] top-[85%] w-52 h-52 rounded-full bg-yellow-300/9  blur-3xl" />
      {/* center */}
      <div className="absolute left-[30%]  top-[25%] w-48 h-48 rounded-full bg-yellow-400/7  blur-3xl" />
      <div className="absolute right-[28%] top-[65%] w-44 h-44 rounded-full bg-amber-200/8  blur-3xl" />

      {/* ── Rings ── */}
      {/* left */}
      <div className="absolute left-[4%] top-[14%] w-14 h-14 rounded-full border border-yellow-400/18" />
      <div className="absolute left-[2%] top-[13%] w-[88px] h-[88px] rounded-full border border-yellow-400/9" />
      <div className="absolute left-[5%] top-[48%] w-10 h-10 rounded-full border border-yellow-500/15" />
      <div className="absolute left-[3%] top-[47%] w-[72px] h-[72px] rounded-full border border-yellow-400/8" />
      <div className="absolute left-[4%] top-[82%] w-12 h-12 rounded-full border border-yellow-400/15" />
      {/* right */}
      <div className="absolute right-[4%] top-[28%] w-14 h-14 rounded-full border border-yellow-400/18" />
      <div className="absolute right-[2%] top-[27%] w-[88px] h-[88px] rounded-full border border-yellow-400/9" />
      <div className="absolute right-[5%] top-[62%] w-10 h-10 rounded-full border border-yellow-500/15" />
      <div className="absolute right-[3%] top-[61%] w-[72px] h-[72px] rounded-full border border-yellow-400/8" />
      <div className="absolute right-[4%] top-[90%] w-12 h-12 rounded-full border border-yellow-400/15" />
      {/* center */}
      <div className="absolute left-[22%]  top-[36%] w-10 h-10 rounded-full border border-yellow-400/12" />
      <div className="absolute right-[24%] top-[70%] w-8  h-8  rounded-full border border-yellow-400/12" />

      {/* ── Rotated squares ── */}
      {/* left */}
      <div className="absolute left-[7%] top-[22%] w-5 h-5 border border-yellow-500/20 rotate-45" />
      <div className="absolute left-[6%] top-[21%] w-9 h-9 border border-yellow-400/10 rotate-45" />
      <div className="absolute left-[8%] top-[58%] w-4 h-4 border border-yellow-500/18 rotate-[30deg]" />
      <div className="absolute left-[6%] top-[91%] w-5 h-5 border border-yellow-400/15 rotate-12" />
      {/* right */}
      <div className="absolute right-[7%] top-[10%] w-5 h-5 border border-yellow-500/20 rotate-12" />
      <div className="absolute right-[6%] top-[9%]  w-9 h-9 border border-yellow-400/10 rotate-12" />
      <div className="absolute right-[8%] top-[40%] w-4 h-4 border border-yellow-500/18 rotate-45" />
      <div className="absolute right-[6%] top-[75%] w-5 h-5 border border-yellow-400/15 rotate-[30deg]" />
      {/* center */}
      <div className="absolute left-[42%]  top-[18%] w-4 h-4 border border-yellow-500/15 rotate-45" />
      <div className="absolute right-[38%] top-[58%] w-4 h-4 border border-yellow-400/15 rotate-[22deg]" />
      <div className="absolute left-[50%]  top-[85%] w-4 h-4 border border-yellow-400/12 rotate-45" />

      {/* ── Small filled dots ── */}
      {/* left edge */}
      <div className="absolute left-[10%] top-[5%]  w-1.5 h-1.5 rounded-full bg-yellow-400/30" />
      <div className="absolute left-[9%]  top-[32%] w-2   h-2   rounded-full bg-yellow-500/22" />
      <div className="absolute left-[11%] top-[66%] w-1.5 h-1.5 rounded-full bg-yellow-400/25" />
      <div className="absolute left-[8%]  top-[95%] w-2   h-2   rounded-full bg-yellow-500/20" />
      {/* right edge */}
      <div className="absolute right-[10%] top-[15%] w-1.5 h-1.5 rounded-full bg-yellow-400/28" />
      <div className="absolute right-[9%]  top-[48%] w-2   h-2   rounded-full bg-yellow-500/22" />
      <div className="absolute right-[11%] top-[78%] w-1.5 h-1.5 rounded-full bg-yellow-400/25" />
      {/* center */}
      <div className="absolute left-[38%]  top-[8%]  w-1.5 h-1.5 rounded-full bg-yellow-400/22" />
      <div className="absolute right-[36%] top-[35%] w-1.5 h-1.5 rounded-full bg-yellow-500/18" />
      <div className="absolute left-[48%]  top-[60%] w-2   h-2   rounded-full bg-yellow-400/20" />
      <div className="absolute right-[42%] top-[80%] w-1.5 h-1.5 rounded-full bg-yellow-500/18" />

      {/* ── Short horizontal lines ── */}
      {/* left */}
      <div className="absolute left-[6%] top-[35%] w-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      <div className="absolute left-[5%] top-[72%] w-6 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent" />
      {/* right */}
      <div className="absolute right-[6%] top-[20%] w-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
      <div className="absolute right-[5%] top-[55%] w-6 h-px bg-gradient-to-r from-transparent via-yellow-400/25 to-transparent" />
      <div className="absolute right-[6%] top-[88%] w-8 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      {/* center */}
      <div className="absolute left-[28%]  top-[50%] w-8 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      <div className="absolute right-[30%] top-[75%] w-6 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
    </div>
  )
}
