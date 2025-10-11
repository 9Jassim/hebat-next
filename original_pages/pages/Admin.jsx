import { Link, useNavigate } from "react-router-dom"
import { LogInUser } from "../services/Auth"
import { useRef, useState } from "react"
const Admin = ({ setUser }) => {
  let navigate = useNavigate()
  const formRef = {
    email: useRef(null),
    password: useRef(null),
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await LogInUser({
      email: formRef.email.current.value,
      password: formRef.password.current.value,
    })
    setUser(payload)
    if (payload) {
      navigate(`/products`)
    } else {
      formRef.password.current.value = ""
    }
  }
  return (
    <div>
      <div class="flex flex-col items-center justify-center my-auto">
        <div class="w-full bg-yellow-500 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Sign in
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  ref={formRef.email}
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  ref={formRef.password}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  required=""
                />
              </div>
              <button
                onClick={handleSubmit}
                type="submit"
                class="w-full  text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Admin
