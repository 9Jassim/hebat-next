"use client"

import { useEffect, useState, Fragment } from "react"
import { useRouter } from "next/navigation"
import Client from "@/lib/api"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import EditProductForm from "@/components/EditProductForm"

export default function ProductDetails({ params }) {
  const router = useRouter()
  const { slug } = params // ✅ Next.js App Router way to get slug

  const [product, setProduct] = useState(null)
  const [clamped, setClamped] = useState(true)
  const [openRemove, setOpenRemove] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  // Fetch product by slug
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await Client.get(`/products/${slug}`, { withCredentials: true })
        setProduct(res.data.product)
      } catch (err) {
        console.error("Failed to fetch product:", err)
      }
    }
    getProduct()
  }, [slug])

  const handleRemove = async () => {
    try {
      await Client.delete(`/products/${product._id}`, { withCredentials: true })
      setOpenRemove(false)
      router.push("/products")
    } catch (err) {
      console.error("Error deleting product:", err)
    }
  }

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Loading product...
      </div>
    )

  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        <Fragment>
          <button
            onClick={() => setOpenEdit(true)}
            type="button"
            className="text-white bg-green-700 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                clipRule="evenodd"
              />
            </svg>
            Edit
          </button>

          <Dialog
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            aria-labelledby="edit-dialog-title"
          >
            <DialogTitle id="edit-dialog-title">Edit Product Details</DialogTitle>
            <DialogContent>
              <EditProductForm
                product={product}
                setProduct={setProduct}
                handleCloseE={() => setOpenEdit(false)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEdit(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Fragment>

        <Fragment>
          <button
            onClick={() => setOpenRemove(true)}
            type="button"
            className="text-white bg-red-700 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                clipRule="evenodd"
              />
            </svg>
            Remove
          </button>

          <Dialog
            open={openRemove}
            onClose={() => setOpenRemove(false)}
            aria-labelledby="remove-dialog-title"
          >
            <DialogTitle id="remove-dialog-title">Remove Product From Inventory?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpenRemove(false)}>Cancel</Button>
              <Button onClick={handleRemove} color="error">
                Remove
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      </div>

      {/* Product Content */}
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h1 className="block text-2xl font-bold text-yellow-500 mb-3">{product.name}</h1>
          <p className="text-gray-700 text-sm mb-2">
            <strong>Barcode:</strong> {product.barcode || "N/A"}
          </p>
          <p className="text-gray-700 text-sm mb-4">
            <strong>Model:</strong> {product.model || "N/A"}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
          <p className={`text-gray-800 mb-4 ${clamped ? "line-clamp-3" : ""}`}>
            {product.description}
          </p>
          <button
            onClick={() => setClamped(!clamped)}
            className="text-yellow-600 hover:underline text-sm font-medium"
          >
            {clamped ? "Read more" : "Read less"}
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Manual</h2>
          {product.manual ? (
            <a
              href={product.manual.s3Url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              📄 View Manual
            </a>
          ) : (
            <p className="text-gray-600 text-sm">No manual available</p>
          )}
        </div>

        <div>
          {product.image?.s3Url ? (
            <img
              src={product.image.s3Url}
              alt={product.name}
              className="w-full rounded-lg shadow"
            />
          ) : (
            <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500 rounded-lg">
              No image available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
