import { useEffect, useState } from "react"
import axios from "../axios"
import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"

export default function ProductForm() {
  const [categories] = useFetch("/category")
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState("")
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
          setCategory(product.category)
          setImage(product.image)
        })
        .catch((err) => console.log(err))
    }
  }, [slug])

  function handleSubmit(e) {
    e.preventDefault()

    const options = {
      headers: { "Content-Type": "multipart/form-data" },
    }

    if (slug) {
      axios
        .put(`/product/${slug}`, { id, name, price, description, category, image }, options)
        .then((res) => navigate(`/product/${res.data.slug}`))
        .catch((err) => {
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    } else {
      axios
        .post("/product", { name, price, description, category, image }, options)
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
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="text-gray-600">
                  Name
                </label>
                <input
                  id="name"
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
                  id="price"
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
                  id="desc"
                  name="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                ></textarea>
              </div>
              {categories && (
                <div>
                  <label htmlFor="category" className="text-gray-600">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="block w-full mt-2 border-gray-300 rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="image" className="text-gray-600">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full mt-2 border-gray-300 rounded"
                />
              </div>
              <button className="px-6 py-3 bg-blue-700 text-white hover:bg-blue-800 rounded">{btnText}</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
