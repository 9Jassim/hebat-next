"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"

export default function NewsletterPage() {
  const { user } = useAuth()
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedSub, setSelectedSub] = useState(null)
  const [sending, setSending] = useState(false)

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

  // ✅ Send message to all subscribers
  const handleSend = async e => {
    e.preventDefault()
    if (!message.trim()) return alert("Please enter a message before sending.")

    setSending(true)
    try {
      await Client.post("/newsletter/send", { message }, { withCredentials: true })
      alert("✅ Message sent successfully to all subscribers!")
      setMessage("")
    } catch (err) {
      console.error("❌ Failed to send newsletter:", err)
      alert("Failed to send message. Please try again.")
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

      {/* Send message section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Send Message to All Subscribers
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            rows="4"
            placeholder="Write your newsletter message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:ring-yellow-500 focus:border-yellow-500"
          ></textarea>

          <Button
            type="submit"
            variant="contained"
            disabled={sending}
            className="!bg-yellow-500 hover:!bg-yellow-600 text-white font-semibold"
          >
            {sending ? "Sending..." : "Send to All Subscribers"}
          </Button>
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
