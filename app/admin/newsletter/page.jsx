"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import RichTextEditor from "@/components/RichTextEditor"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"

export default function NewsletterPage() {
  const { user } = useAuth()
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [previewEmail, setPreviewEmail] = useState("")
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)
  const [sending, setSending] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  // Bumped to force the rich-text editor to remount and clear after a send.
  const [editorKey, setEditorKey] = useState(0)

  // The body is HTML from the editor; it counts as content if it has text or
  // an image (a newsletter can be just an image with all the info in it).
  const bodyIsEmpty = () => {
    const hasImage = /<img\b/i.test(body)
    const hasText = body
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim()
    return !hasImage && !hasText
  }

  // ✅ Fetch subscribers
  const fetchSubscribers = async () => {
    try {
      const res = await Client.get("/newsletter", { withCredentials: true })
      setSubscribers(res.data.subscribers || [])
    } catch (err) {
      console.error("❌ Error fetching subscribers:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  // Default the preview address to the logged-in admin's own email
  useEffect(() => {
    if (user?.email) setPreviewEmail(prev => prev || user.email)
  }, [user])

  // 👁️ Send a single preview email before the full send
  const handlePreview = async () => {
    if (!subject.trim()) return alert("Please enter a subject before previewing.")
    if (bodyIsEmpty()) return alert("Please enter a body before previewing.")
    if (!previewEmail.trim()) return alert("Please enter an email address to send the preview to.")

    setPreviewing(true)
    try {
      await Client.post(
        "/newsletter/preview",
        { subject, body, email: previewEmail },
        { withCredentials: true }
      )
      alert(`✅ Preview sent to ${previewEmail}`)
    } catch (err) {
      console.error("❌ Failed to send preview:", err)
      alert("Failed to send preview. Please try again.")
    } finally {
      setPreviewing(false)
    }
  }

  // ✅ Send newsletter to all subscribers
  const handleSend = async e => {
    e.preventDefault()
    if (!subject.trim()) return alert("Please enter a subject before sending.")
    if (bodyIsEmpty()) return alert("Please enter a body before sending.")

    if (!window.confirm(`Send this newsletter to all ${subscribers.length} subscribers?`)) return

    setSending(true)
    try {
      await Client.post("/newsletter/send", { subject, body }, { withCredentials: true })
      alert("✅ Newsletter sent successfully to all subscribers!")
      setSubject("")
      setBody("")
      setEditorKey(k => k + 1)
    } catch (err) {
      console.error("❌ Failed to send newsletter:", err)
      alert("Failed to send newsletter. Please try again.")
    } finally {
      setSending(false)
    }
  }

  // ✅ Remove a subscriber
  const handleRemove = async () => {
    try {
      await Client.delete(`/newsletter/${selectedSub._id}`, {
        withCredentials: true,
      })
      setSubscribers(prev => prev.filter(s => s._id !== selectedSub._id))
      setOpenConfirm(false)
    } catch (err) {
      console.error("❌ Failed to remove subscriber:", err)
      alert("Error removing subscriber.")
    }
  }

  // 🚫 Only admins can view this page
  if (!user)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        You must be logged in as an admin to access this page.
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">Newsletter Management</h1>

      {/* Compose section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Compose Newsletter</h2>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Email subject line..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <RichTextEditor
              key={editorKey}
              value={body}
              onChange={setBody}
              allowImages
              placeholder="Write your newsletter body... use RTL for Arabic and LTR for English."
            />
            <p className="text-xs text-gray-500 mt-1">
              Use the toolbar to format text and set alignment. Switch a line to RTL for Arabic or
              LTR for English.
            </p>
          </div>

          {/* Preview section */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Send a preview first
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Send this email to a single address to check how it looks before sending to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="preview@example.com"
                value={previewEmail}
                onChange={e => setPreviewEmail(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <Button
                type="button"
                variant="outlined"
                onClick={handlePreview}
                disabled={previewing}
                className="!border-yellow-500 !text-yellow-600 hover:!bg-yellow-50 font-semibold whitespace-nowrap"
              >
                {previewing ? "Sending..." : "Send Preview"}
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <Button
              type="submit"
              variant="contained"
              disabled={sending}
              className="!bg-yellow-500 hover:!bg-yellow-600 text-white font-semibold"
            >
              {sending ? "Sending..." : "Send to All Subscribers"}
            </Button>
          </div>
        </form>
      </div>

      {/* Subscribers list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Subscribers ({subscribers.length})
        </h2>

        {loading ? (
          <p className="text-gray-600 text-sm">Loading subscribers...</p>
        ) : subscribers.length === 0 ? (
          <p className="text-gray-600 text-sm">No subscribers yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm text-left text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-900 font-semibold">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, idx) => (
                <tr key={sub._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3">{sub.email}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedSub(sub)
                        setOpenConfirm(true)
                      }}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirm Remove Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Remove Subscriber?</DialogTitle>
        <DialogContent>
          <p className="text-gray-700">
            Are you sure you want to remove{" "}
            <span className="font-semibold">{selectedSub?.email}</span> from the newsletter list?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleRemove} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
