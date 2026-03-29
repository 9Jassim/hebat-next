import { useRef } from "react"

export function useDragScroll() {
  const ref = useRef(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const hasDragged = useRef(false)

  const onMouseDown = e => {
    isDown.current = true
    hasDragged.current = false
    startX.current = e.pageX - ref.current.offsetLeft
    scrollStart.current = ref.current.scrollLeft
    // Don't change cursor yet — wait until actual movement
  }

  const onMouseUp = () => {
    isDown.current = false
    if (ref.current) ref.current.style.cursor = "grab"
  }

  const onMouseLeave = () => {
    isDown.current = false
    if (ref.current) ref.current.style.cursor = "grab"
  }

  const onMouseMove = e => {
    if (!isDown.current) return
    const x = e.pageX - ref.current.offsetLeft
    const walk = x - startX.current
    // Only activate drag once movement exceeds threshold
    if (Math.abs(walk) <= 4) return
    e.preventDefault()
    hasDragged.current = true
    ref.current.style.cursor = "grabbing"
    ref.current.scrollLeft = scrollStart.current - walk
  }

  const onClickCapture = e => {
    if (hasDragged.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return { ref, onMouseDown, onMouseUp, onMouseLeave, onMouseMove, onClickCapture }
}
