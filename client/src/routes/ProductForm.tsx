import { useEffect, useState } from "react"
import axios from "../axios"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../components/Button"

export default function ProductForm() {
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
        .put(`/product/${slug}`, { name, price, description })
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
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    }
  }

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{heading}</h1>
      </header>
      <main className="p-8 pt-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name">Name</label>
              <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input name="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label htmlFor="desc">Description</label>
              <textarea name="desc" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <button>{btnText}</button>
            <Button>{btnText}</Button>
          </div>
        </form>
      </main>
    </div>
  )
}
