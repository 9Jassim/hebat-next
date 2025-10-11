import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Client from "../services/api"
const NewProduct = ({ user }) => {
  let navigate = useNavigate()
  const [newCategory, setNewCategory] = useState(false)
  const [categories, setCategories] = useState([])
  const categoryRef = useRef(null)
  const formRef = {
    model: useRef(null),
    barcode: useRef(null),
    name: useRef(null),
    description: useRef(null),
    category: useRef(null),
    manual: useRef(null),
    image: useRef(null),
  }
  useEffect(() => {
    if (!user) {
      navigate("/admin")
    }
    const getCategories = async () => {
      const response = await Client.get("/products/category")
      setCategories(response.data.categories)
    }
    getCategories()
  }, [])
  const addProduct = async (event) => {
    event.preventDefault()
    const product = {
      model: formRef.model.current.value,
      barcode: formRef.barcode.current.value,
      name: formRef.name.current.value,
      description: formRef.description.current.value,
      category: formRef.category.current.value,
      manual: formRef.manual.current.files[0],
      image: formRef.image.current.files[0],
    }
    const response = await Client.post(`/products`, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    const slug = response.data.product.slug
    formRef.model.current.value = null
    formRef.barcode.current.value = null
    formRef.name.current.value = null
    formRef.description.current.value = null
    formRef.category.current.value = ""
    formRef.manual.current.value = null
    formRef.image.current.value = null
    navigate(`/products/${slug}`)
  }
  const addCategory = async () => {
    const response = await Client.post("/products/category", {
      name: categoryRef.current.value,
    })
    setCategories((prev) => [...prev, response.data.category])
    categoryRef.current.value = ""
    setNewCategory(!newCategory)
  }
  return (
    <div className="flex flex-col w-full ">
      <form class="flex flex-col my-2 gap-3 p-2.5 shadow-lg border border-gray-300 rounded-lg w-full max-w-sm mx-auto pt-5 bg-yellow-500 ">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
          New Product
        </h1>
        <div>
          <label
            for="model"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Model
          </label>
          <input
            type="text"
            id="model"
            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product model"
            ref={formRef.model}
          />
        </div>
        <div>
          <label
            for="barcode"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Barcode
          </label>
          <input
            type="text"
            id="model"
            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product model"
            ref={formRef.barcode}
          />
        </div>
        <div>
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product name"
            ref={formRef.name}
          />
        </div>
        <div>
          <label
            for="description"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            id="description"
            rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Product description"
            ref={formRef.description}
          ></textarea>
        </div>
        <div>
          <label
            for="category"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Category
          </label>
          <select id="category" name="category" ref={formRef.category}>
            <option value="" selected>
              --Category--
            </option>
            {categories.map((category) => (
              <option key={category.name} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <span
            className="mx-2 cursor-pointer"
            onClick={() => {
              setNewCategory(!newCategory)
            }}
          >
            New
          </span>
          {newCategory && (
            <div className="flex">
              <input
                type="text"
                id="category-name"
                class="block p-2 mt-1 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500"
                placeholder="new category name"
                ref={categoryRef}
              />
              <button
                onClick={addCategory}
                type="button"
                class=" h-9 mt-1 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm ml-1 p-2.5 text-center inline-flex items-center me-2 "
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Manual
          </label>
          <input
            class="p-1.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            id="manual"
            name="manual"
            type="file"
            ref={formRef.manual}
          ></input>
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900">
            Image
          </label>
          <input
            class="p-1.5 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            id="image"
            name="image"
            type="file"
            ref={formRef.image}
          ></input>
        </div>
        <button
          onClick={addProduct}
          class="flex justify-center w-full text-white bg-black hover:bg-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center me-2"
        >
          <svg
            className="m-1 w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
              clip-rule="evenodd"
            />
          </svg>
          Add Product
        </button>
      </form>
    </div>
  )
}
export default NewProduct
