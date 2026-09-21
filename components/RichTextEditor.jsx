"use client"

import { useEffect, useRef } from "react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Eraser,
} from "lucide-react"

/**
 * Lightweight rich-text editor built on contentEditable.
 *
 * It intentionally emits INLINE styles (via styleWithCSS) rather than CSS
 * classes, so the produced HTML renders correctly inside email clients.
 * Supports RTL/LTR direction per block, which is needed for newsletters that
 * mix Arabic and English.
 *
 * Uncontrolled: the initial value seeds the editor once; changes are reported
 * through onChange. To reset it from the parent, change its `key` prop.
 */
export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "",
  allowImages = false,
}) {
  const ref = useRef(null)
  const initial = useRef(value)
  const fileInputRef = useRef(null)
  const savedRange = useRef(null)

  // Seed content once on mount (avoids cursor jumps from re-writing innerHTML).
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = initial.current || ""
      try {
        document.execCommand("defaultParagraphSeparator", false, "p")
      } catch {
        // Not supported everywhere; harmless to ignore.
      }
    }
  }, [])

  const emit = () => {
    if (onChange && ref.current) onChange(ref.current.innerHTML)
  }

  const exec = (command, arg = null) => {
    try {
      document.execCommand("styleWithCSS", false, true)
    } catch {
      // ignore
    }
    document.execCommand(command, false, arg)
    ref.current?.focus()
    emit()
  }

  // Set text direction + matching alignment on every block the selection spans.
  const setDirection = dir => {
    const editor = ref.current
    if (!editor) return
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    const range = sel.getRangeAt(0)

    const applyDir = el => {
      if (!el || !el.style) return
      el.style.direction = dir
      el.style.textAlign = dir === "rtl" ? "right" : "left"
    }

    // Every top-level block the selection touches (works across multiple lines).
    const blocks = Array.from(editor.children).filter(
      child => child.nodeType === Node.ELEMENT_NODE && range.intersectsNode(child)
    )

    if (blocks.length > 0) {
      blocks.forEach(applyDir)
    } else {
      // No block wrappers touched (e.g. a single unwrapped line): climb to the
      // block containing the caret, falling back to the editor itself.
      let node = sel.anchorNode
      if (node && node.nodeType === Node.TEXT_NODE) node = node.parentNode
      while (node && node.parentNode && node.parentNode !== editor) {
        node = node.parentNode
      }
      applyDir(node && node !== editor && node.style ? node : editor)
    }

    editor.focus()
    emit()
  }

  // Ask for a URL and normalise it (adds https:// when no scheme is given).
  const promptUrl = () => {
    let url = window.prompt("Enter the link URL:", "https://")
    if (!url) return null
    url = url.trim()
    if (!url || url === "https://") return null
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) url = `https://${url}`
    return url
  }

  // Return the single image the current selection covers, or null.
  const getSelectedImage = sel => {
    if (!sel || !sel.rangeCount) return null
    const range = sel.getRangeAt(0)
    const frag = range.cloneContents()
    if (frag.childNodes.length !== 1 || frag.firstChild.nodeName !== "IMG") {
      return null
    }
    const root =
      range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentNode
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT)
    let node
    while ((node = walker.nextNode())) {
      if (node.nodeName === "IMG" && range.intersectsNode(node)) return node
    }
    return null
  }

  const addLink = () => {
    const editor = ref.current
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) {
      alert("Select some text or an image to link first.")
      return
    }

    // 🖼️ Linking an image: wrap it (or update its existing link).
    const img = getSelectedImage(sel)
    if (img) {
      const url = promptUrl()
      if (!url) return
      const existing = img.closest("a")
      if (existing) {
        existing.setAttribute("href", url)
        existing.setAttribute("target", "_blank")
        existing.setAttribute("rel", "noopener")
      } else {
        const a = document.createElement("a")
        a.setAttribute("href", url)
        a.setAttribute("target", "_blank")
        a.setAttribute("rel", "noopener")
        img.parentNode.insertBefore(a, img)
        a.appendChild(img)
      }
      emit()
      return
    }

    // ✍️ Linking text: need a non-empty text selection.
    if (sel.isCollapsed) {
      alert("Highlight the text or select an image you want to link first.")
      return
    }

    // Opening a prompt clears the selection, so save it and restore it after.
    const saved = sel.getRangeAt(0).cloneRange()
    const url = promptUrl()
    if (!url) return

    editor?.focus()
    sel.removeAllRanges()
    sel.addRange(saved)

    document.execCommand("createLink", false, url)
    emit()
  }

  // Remember where the caret is, then open the file picker.
  const pickImage = () => {
    const sel = window.getSelection()
    savedRange.current = sel && sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null
    fileInputRef.current?.click()
  }

  // Embed the chosen image inline as a data URL at the saved caret position.
  // Nothing is uploaded here — the server uploads to S3 only when the newsletter
  // is actually sent, so images inserted but never sent don't pile up in S3.
  const handleFileChange = e => {
    const file = e.target.files?.[0]
    e.target.value = "" // allow re-selecting the same file later
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.")
      return
    }

    // Guard against very large images (they bloat the email and the request).
    const MAX_MB = 5
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`Image is too large. Please use an image under ${MAX_MB}MB.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const editor = ref.current
      editor?.focus()
      if (savedRange.current) {
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(savedRange.current)
      }

      // width:100% (plus the width attribute for Outlook) makes the image fit the
      // block; some email clients ignore max-width and would otherwise clip it.
      const imgHtml = `<img src="${dataUrl}" alt="Hebat" width="530" style="width:100%;max-width:100%;height:auto;display:block;margin:12px auto;border:0;" />`
      document.execCommand("insertHTML", false, imgHtml)
      emit()
    }
    reader.onerror = () => alert("Failed to read the image. Please try again.")
    reader.readAsDataURL(file)
  }

  return (
    <div className="border border-gray-300 dark:border-neutral-700 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-yellow-500 focus-within:border-yellow-500">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 px-2 py-1.5">
        <ToolbarButton title="Bold" onClick={() => exec("bold")}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" onClick={() => exec("italic")}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline" onClick={() => exec("underline")}>
          <Underline size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Align left" onClick={() => exec("justifyLeft")}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align center" onClick={() => exec("justifyCenter")}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align right" onClick={() => exec("justifyRight")}>
          <AlignRight size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Left-to-right (English)" onClick={() => setDirection("ltr")}>
          <span className="text-xs font-semibold">LTR</span>
        </ToolbarButton>
        <ToolbarButton title="Right-to-left (Arabic)" onClick={() => setDirection("rtl")}>
          <span className="text-xs font-semibold">RTL</span>
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Bullet list" onClick={() => exec("insertUnorderedList")}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" onClick={() => exec("insertOrderedList")}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Insert link" onClick={addLink}>
          <Link2 size={16} />
        </ToolbarButton>
        {allowImages && (
          <ToolbarButton title="Insert image" onClick={pickImage}>
            <ImageIcon size={16} />
          </ToolbarButton>
        )}

        <Divider />

        <ToolbarButton title="Clear formatting" onClick={() => exec("removeFormat")}>
          <Eraser size={16} />
        </ToolbarButton>
      </div>

      {/* Hidden file input for inserting images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="rte-content min-h-[180px] px-4 py-3 bg-white dark:bg-neutral-900 text-gray-800 dark:text-gray-100 text-sm leading-relaxed focus:outline-none"
      />

      <style jsx>{`
        .rte-content:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        /* Tailwind preflight strips list markers; restore them inside the editor. */
        .rte-content :global(ul) {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.25rem 0;
        }
        .rte-content :global(ol) {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.25rem 0;
        }
        .rte-content :global(a) {
          color: #f5b301;
          text-decoration: underline;
        }
        .rte-content :global(p) {
          margin: 0 0 0.5rem;
        }
        .rte-content :global(img) {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  )
}

function ToolbarButton({ title, onClick, children, disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      // Prevent the editor from losing its selection when the button is clicked.
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      className="flex items-center justify-center h-8 min-w-8 px-1.5 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-neutral-600" />
}
