import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Client from "../services/api"
const Products = () => {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showing, setShowing] = useState([])
  const searchRef = useRef("")
  useEffect(() => {
    const getProducts = async () => {
      const response = await Client.get("/products")
      setProducts(response.data.products)
      setShowing(response.data.products)
    }
    getProducts()
    const getCategories = async () => {
      const response = await Client.get("/products/category")
      setCategories(response.data.categories)
    }
    getCategories()
  }, [])
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }
  const handleMouseLeave = () => {
    setIsDragging(false)
  }
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk
  }
  const handleTouchStart = (e) => {
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }
  const handleTouchMove = (e) => {
    if (!isDragging) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }
  const handleTouchEnd = () => {
    setIsDragging(false)
  }
  const filter = (categoryName) => {
    const temp = products.filter(
      (product) => product.category && product.category.name === categoryName
    )
    setShowing(temp)
  }
  const resetFilter = () => {
    setShowing(products)
  }
  const handleSearch = () => {
    if (searchRef.current.value === "") {
      setShowing(products)
    } else {
      const result = products.filter((product) =>
        product.name
          .toLowerCase()
          .includes(searchRef.current.value.toLowerCase())
      )
      setShowing(result)
    }
  }
  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col items-center mb-9">
        <form class="flex items-center max-w-sm mx-auto w-full">
          <div class="w-full">
            <input
              type="text"
              id="simple-search"
              class="bg-gray-100 border border-yellow-500 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full ps-10 p-2.5 "
              placeholder="Search product name..."
              ref={searchRef}
              onChange={handleSearch}
              required
            />
          </div>
        </form>
        <div
          ref={scrollRef}
          className="inline-flex justify-center rounded-md overflow-auto w-2/3 p-4"
          role="group"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={resetFilter}
            type="button"
            class="text-black hover:text-black border border-yellow-400 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3"
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => filter(category.name)}
              name={category.name}
              type="button"
              class="text-black hover:text-black border border-yellow-400 bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 rounded-full text-base font-medium px-5 py-2.5 text-center me-3 mb-3"
            >
              {category.name}
            </button>
          ))}
        </div>
        <span className="">Total {showing.length} products</span>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 w-3/4">
          {showing.map((product) => (
            <Link key={product.slug} to={`/products/${product.slug}`}>
              <div class="h-full max-w-full border border-yellow-500 bg-yellow-500 rounded-lg hover:scale-125 transition duration-300 ease-in-out hover:shadow-lg hover:shadow-yellow-500">
                <img class="rounded-t-lg" src={product.image.s3Url} alt="" />
                <div class="p-5">
                  <a href="#">
                    <h5 class="mb-2 text-xl font-semibold tracking-tight text-gray-900">
                      {product.name}
                    </h5>
                  </a>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Products
