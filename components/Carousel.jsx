"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Carousel() {
  const images = ["/hebat_cover.png", "/carousel_1.png", "/carousel_2.png", "/carousel_3.png"]

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)

  // autoplay
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => handleNext(), 3000)
    }
    return () => clearInterval(intervalRef.current)
  }, [paused])

  const handleNext = () => {
    setIndex(prev => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const handleDragEnd = (e, info) => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    if (offset > 100 || velocity > 500) handlePrev()
    else if (offset < -100 || velocity < -500) handleNext()
  }

  const variants = {
    enter: direction => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: direction => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-2xl w-full bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[22rem] md:h-[26rem] lg:h-[30rem] flex items-center justify-center">
        <AnimatePresence mode="popLayout" custom={index}>
          <motion.img
            key={index}
            src={images[index]}
            custom={index}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.5 },
              opacity: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            alt={`Slide ${index + 1}`}
            className="absolute max-h-full max-w-full object-contain select-none pointer-events-none"
          />
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-yellow-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
