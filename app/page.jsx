"use client"
import Link from "next/link"
const Home = () => {
  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm-y-20 lg-0 lg-w-none lg-cols-2">
          <div className="lg-8 lg-4">
            <div className="lg-w-lg">
              <p className="mt-2 text-3xl font-bold tracking-tight text-yellow-500 ">
                HEBAT
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-800">
                Our products are selected for quality, variety, and customer
                satisfaction. <br /> <br />
                With a keen eye for detail, we ensure a delightful shopping
                experience that keeps you coming back. <br /> <br />
                Customer satisfaction is our top priority. We strive to provide
                the best products to meet your needs. <br />
                <br />
                Visit our shop website.
              </p>
              <button
                onClick={() => window.open("https://morslon.com/", "_blank")}
                type="button"
                className="text-white bg-yellow-500 hover-yellow-600 focus-4 focus-none focus-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
              >
                <svg
                  className="w-3.5 h-3.5 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 21"
                >
                  <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>
                Morslon
              </button>
            </div>
          </div>
          <Link href="#"
            to="/products"
            className=" my-10 w-[48rem] max-w-md rounded-xl shadow-xl ring-1 ring-gray-400/10 sm-[57rem] md:-ml-4 lg:-ml-0"
          >
            <img src="src\assets\hebat_cover.png" alt="Product screenshot" />
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Home
