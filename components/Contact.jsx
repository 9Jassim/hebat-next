import Link from "next/link"

export default function Contact() {
  return (
    <section className="pt-[50px] pb-20 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-black text-center mb-6">
          Contact <span className="text-yellow-500 ">Us</span>
        </h1>
        <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">
          Have questions or need assistance? We’d love to hear from you! Whether you’re a customer,
          supplier, or partner — our team is always ready to help.
        </p>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Get in Touch</h2>
            <p className="text-gray-700">
              Our support team is available to help with product questions, order assistance, or
              partnership inquiries.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <Link
                  href="mailto:info@hebat.com"
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  info@hebat.com
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-700">+973 33176767</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Office</h3>
                <p className="text-gray-700">
                  Tubli, Bahrain
                  <br />
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-gray-800 mb-2">Follow Us</h3>
              <div className="flex justify-start space-x-3 flex-wrap">
                {/* Instagram */}
                <Link
                  href="https://www.instagram.com/morslon.bh?utm_source=hebat&utm_medium=app&utm_campaign=sociallink"
                  target="_blank"
                  className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center transition-transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* YouTube */}
                <Link
                  href="https://www.youtube.com/@morslon_bh?utm_source=hebat&utm_medium=app&utm_campaign=sociallink"
                  target="_blank"
                  className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center transition-transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                {/* TikTok */}
                <Link
                  href="https://www.tiktok.com/@morslon.bh?utm_source=hebat&utm_medium=app&utm_campaign=sociallink"
                  target="_blank"
                  className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center transition-transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.438 2.017C13.53 2 14.613 2.008 15.696 2c.067 1.275.525 2.575 1.459 3.475c.933.925 2.25 1.35 3.533 1.492v3.358c-1.2-.042-2.408-.292-3.5-.808c-.475-.217-.917-.492-1.35-.775c-.008 2.433.008 4.866-.017 7.291a6.36 6.36 0 0 1-1.125 3.283c-1.091 1.6-2.983 2.642-4.924 2.675c-1.192.067-2.384-.258-3.4-.858c-1.684-.992-2.867-2.808-3.042-4.758a16 16 0 0 1-.008-1.242c.15-1.583.933-3.1 2.15-4.133c1.383-1.2 3.316-1.775 5.125-1.433c.016 1.233-.034 2.466-.034 3.7c-.825-.267-1.791-.192-2.516.308a2.9 2.9 0 0 0-1.134 1.458c-.175.425-.125.892-.116 1.342c.2 1.366 1.516 2.516 2.916 2.392c.934-.009 1.825-.55 2.309-1.342c.158-.275.333-.559.341-.884c.084-1.491.05-2.975.059-4.466c.008-3.358-.009-6.708.016-10.058" />
                  </svg>
                </Link>

                {/* Snapchat */}
                <Link
                  href="https://www.snapchat.com/add/morslon.bh?utm_source=hebat&utm_medium=app&utm_campaign=sociallink"
                  target="_blank"
                  className="text-white bg-yellow-500 hover:bg-yellow-600 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center transition-transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M15.943 11.526c-.111-.303-.323-.465-.564-.599a1.416 1.416 0 0 0-.123-.064l-.219-.111c-.752-.399-1.339-.902-1.746-1.498a3.387 3.387 0 0 1-.3-.531c-.034-.1-.032-.156-.008-.207a.338.338 0 0 1 .097-.1c.129-.086.262-.173.352-.231c.162-.104.289-.187.371-.245c.309-.216.525-.446.66-.702a1.397 1.397 0 0 0 .069-1.16c-.205-.538-.713-.872-1.329-.872a1.829 1.829 0 0 0-.487.065c.006-.368-.002-.757-.035-1.139c-.116-1.344-.587-2.048-1.077-2.61a4.294 4.294 0 0 0-1.095-.881C9.764.216 8.92 0 7.999 0c-.92 0-1.76.216-2.505.641c-.412.232-.782.53-1.097.883c-.49.562-.96 1.267-1.077 2.61c-.033.382-.04.772-.036 1.138a1.83 1.83 0 0 0-.487-.065c-.615 0-1.124.335-1.328.873a1.398 1.398 0 0 0 .067 1.161c.136.256.352.486.66.701c.082.058.21.14.371.246l.339.221a.38.38 0 0 1 .109.11c.026.053.027.11-.012.217a3.363 3.363 0 0 1-.295.52c-.398.583-.968 1.077-1.696 1.472c-.385.204-.786.34-.955.8c-.128.348-.044.743.28 1.075c.119.125.257.23.409.31a4.43 4.43 0 0 0 1 .4a.66.66 0 0 1 .202.09c.118.104.102.26.259.488c.079.118.18.22.296.3c.33.229.701.243 1.095.258c.355.014.758.03 1.217.18c.19.064.389.186.618.328c.55.338 1.305.802 2.566.802c1.262 0 2.02-.466 2.576-.806c.227-.14.424-.26.609-.321c.46-.152.863-.168 1.218-.181c.393-.015.764-.03.095-.258Z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-yellow-200">
            <h2 className="text-2xl font-semibold text-yellow-500 mb-6">Send Us a Message</h2>
            <form
              action="https://formsubmit.co/c9a872ab0e1040e48e0fe8d14d09e49a"
              method="POST"
              className="space-y-5"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="http://localhost:4000/thank-you" />
              <input type="hidden" name="_template" value="table" />
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-yellow-500 focus:border-yellow-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg transition-all shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
