"use client"

import Link from "next/link"
import { Fragment, useState } from "react"

import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Button from "@mui/material/Button"
import EditCategories from "./EditCategories"

export default function Nav({ user, handleLogOut }) {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <nav className="bg-black border-gray-200 mb-10">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://hebat-products.s3.me-south-1.amazonaws.com/Hebat_Logo_Text_page-0001.jpg"
            className="h-12"
            alt="Hebat Logo"
          />
          <span className="text-yellow-500 self-center text-2xl font-semibold whitespace-nowrap">
            HEBAT
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-black md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-black">
            {/* Home */}
            <li>
              <Link
                href="/"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
              >
                Home
              </Link>
            </li>

            {/* Products */}
            <li>
              <Link
                href="/products"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
              >
                Products
              </Link>
            </li>

            {/* Only for signed users */}
            {user && (
              <>
                {/* New Product */}
                <li>
                  <Link
                    href="/newproduct"
                    className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                  >
                    New Product
                  </Link>
                </li>

                {/* Categories */}
                <li>
                  <Fragment>
                    <button
                      onClick={handleClickOpen}
                      className="block cursor-pointer py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                    >
                      Categories
                    </button>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">{"Categories"}</DialogTitle>
                      <DialogContent>
                        <span className="text-red-500">
                          Products will be removed from the deleted Category
                        </span>
                        <EditCategories />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                      </DialogActions>
                    </Dialog>
                  </Fragment>
                </li>

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogOut}
                    className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-500 md:p-0"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
