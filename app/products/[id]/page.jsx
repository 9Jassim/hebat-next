"use client"
import { useEffect, useState } from "react"
import Client from "@/lib/api"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Fragment } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import EditForm from "@/components/EditForm"
const ProductDetails = ({ user }) => {
  let { slug } = /* NOTE. Consider using usePathname or dynamic segments. */ null
  let navigate = useNavigate()
  const [product, setProduct] = useState({})
  const [clamped, setClamped] = useState(true)
  const [openR, setOpenR] = useState(false)
  const [openE, setOpenE] = useState(false)
  useEffect(() => {
    const getProduct = async () => {
      const response = await Client.get(`/products/${slug}`)
      setProduct(response.data.product)
    }
    getProduct()
  }, [])
  const handleClickOpenR = () => {
    setOpenR(true)
  }
  const handleCloseR = () => {
    setOpenR(false)
  }
  const handleClickOpenE = () => {
    setOpenE(true)
  }
  const handleCloseE = () => {
    setOpenE(false)
  }
  const removeProduct = async () => {
    await Client.delete(`/products/${product._id}`)
    router.push("/products")
  }
  return (
    <div>
      <div className="max-w-[85rem] mx-auto px-4 sm-6 lg-8">
        {user && (
          <div className="mb-0">
            <Fragment>
              <button
                onClick={handleClickOpenE}
                type="button"
                className="text-white bg-green-700 hover-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
              >
                <svg
                  className="w-auto h-auto me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Edit
              </button>
              <Dialog
                open={openE}
                onClose={handleCloseE}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Edit Product Details"}
                </DialogTitle>
                <DialogContent>
                  <EditForm
                    product={product}
                    setProduct={setProduct}
                    handleCloseE={handleCloseE}
                  ></EditForm>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseE}>Close</Button>
                </DialogActions>
              </Dialog>
            </Fragment>
            <Fragment>
              <button
                onClick={handleClickOpenR}
                type="button"
                className="text-white bg-red-700 hover-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
              >
                <svg
                  className="w-auto h-auto me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Remove
              </button>
              <Dialog
                open={openR}
                onClose={handleCloseR}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Remove Product From Invintory?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleCloseR}>Cancel</Button>
                  <Button onClick={removeProduct} autoFocus>
                    Remove
                  </Button>
                </DialogActions>
              </Dialog>
            </Fragment>
          </div>
        )}
        <div className="grid lg-cols-7 lg-x-8 xl-x-12 lg-center">
          <div className="lg-span-3 flex flex-col justify-evenly h-full">
            <h1 className="block text-lg font-bold text-yellow-500 sm-2xl md-3xl">
              {product.name}
            </h1>
            <span>Barcode</span>
            <span>Model</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Description
              </h1>
              <p
                className={`mt-3 text-lg text-gray-800 ${
                  clamped ? "line-clamp-3" : ""
                }`}
              >
                {product.description}
              </p>
              <a
                onClick={() => setClamped(!clamped)}
                className="font-semibold cursor-pointer"
              >
                {" "}
                {clamped ? "read more" : "read Less"}{" "}
              </a>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Manual</h1>
              <a
                href={product.manual ? product.manual.s3Url : "#"}
                className="inline-flex items-center justify-center p-2 text-base font-medium text-gray-700 rounded-lg bg-gray-200 hover-gray-900 hover-gray-200 "
              >
                <svg
                  className="w-[35px] h-[35px] text-gray-80"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span className="w-full">
                  {product.manual
                    ? "Manual pdf file"
                    : "Manual is not available"}
                </span>
              </a>
            </div>
          </div>
          <div className="lg-span-4 mt-10 lg-0">
            <img
              className="w-full rounded-xl"
              src={product.image?.s3Url}
              alt="product image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductDetails
