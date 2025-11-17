"use client"

import { useEffect, useState } from "react"
import Client from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"

export default function ContactsAdminPage() {
  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  // Dialog: View
  const [openView, setOpenView] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState(null)

  // Dialog: Delete
  const [openConfirm, setOpenConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      const res = await Client.get("/contact", { withCredentials: true })
      setMessages(res.data.messages || [])
    } catch (err) {
      console.error("❌ Error fetching messages:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleView = msg => {
    setSelectedMsg(msg)
    setOpenView(true)
  }

  const handleDeleteConfirm = msg => {
    setSelectedMsg(msg)
    setOpenConfirm(true)
  }

  const handleDelete = async () => {
    if (!selectedMsg) return

    setDeleting(true)

    try {
      await Client.delete(`/contact/${selectedMsg._id}`, { withCredentials: true })
      setMessages(prev => prev.filter(m => m._id !== selectedMsg._id))
      setOpenConfirm(false)
    } catch (err) {
      console.error("❌ Failed to delete message:", err)
      alert("Error deleting message.")
    } finally {
      setDeleting(false)
    }
  }

  // Block unauthenticated users
  if (!user)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600">
        You must be logged in as an admin to access this page.
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">Contact Messages</h1>

      {/* Messages List */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Messages ({messages.length})</h2>

        {loading ? (
          <p className="text-gray-600 text-sm">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-600 text-sm">No messages received yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm text-left text-gray-700">
            <thead>
              <tr className="border-b border-gray-200 text-gray-900 font-semibold">
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, idx) => (
                <tr key={msg._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3">{msg.name}</td>
                  <td className="py-2 px-3">{msg.email}</td>
                  <td className="py-2 px-3">{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-3 text-right space-x-4">
                    <button
                      onClick={() => handleView(msg)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDeleteConfirm(msg)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Contact Message Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="sm">
        <DialogTitle>View Message</DialogTitle>
        <DialogContent dividers>
          {selectedMsg && (
            <div className="space-y-3 text-gray-800">
              <p>
                <strong>Name:</strong> {selectedMsg.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedMsg.email}
              </p>
              <p>
                <strong>Message:</strong>
              </p>
              <p className="bg-gray-100 p-3 rounded">{selectedMsg.message}</p>
              <p className="text-sm text-gray-500">
                Sent on: {new Date(selectedMsg.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Message?</DialogTitle>
        <DialogContent>
          <p className="text-gray-700">
            Are you sure you want to delete this message from{" "}
            <span className="font-semibold">{selectedMsg?.name}</span>?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
