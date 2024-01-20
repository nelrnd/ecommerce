import { useEffect, useState } from "react"
import axios from "../axios"
import { useNavigate, useParams } from "react-router-dom"

export default function ProductForm() {
  const [id, setId] = useState(null)
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState({})

  const { slug } = useParams()
  const navigate = useNavigate()
  const heading = slug ? "Update product" : "Create product"
  const btnText = slug ? "Save" : "Submit"

  useEffect(() => {
    if (slug) {
      axios
        .get(`/product/${slug}`)
        .then((res) => {
          const product = res.data
          setId(product._id)
          setName(product.name)
          setPrice(product.price)
          setDescription(product.description)
        })
        .catch((err) => console.log(err))
    }
  }, [slug])

  function handleSubmit(e) {
    e.preventDefault()

    if (slug) {
      axios
        .put(`/product/${slug}`, { id, name, price, description })
        .then((res) => navigate(`/product/${res.data.slug}`))
        .catch((err) => {
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    } else {
      axios
        .post("/product", { name, price, description })
        .then((res) => navigate(`/product/${res.data.slug}`))
        .catch((err) => {
          console.log(err)
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    }
  }

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <div className="max-w-[52rem] m-auto">
        <header className="p-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{heading}</h1>
        </header>
        <main className="p-8 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="text-gray-600">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="price" className="text-gray-600">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="desc" className="text-gray-600">
                  Description
                </label>
                <textarea
                  name="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                ></textarea>
              </div>
              <button className="px-6 py-3 bg-blue-700 text-white hover:bg-blue-800 rounded">{btnText}</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
