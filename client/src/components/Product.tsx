import { Link, useParams } from "react-router-dom"
import { BiImage } from "react-icons/bi"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"
import { useCart } from "../providers/CartProvider"
import { useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE

export default function Product() {
  const { slug } = useParams()
  const [product, loading] = useFetch(`/product/${slug}`)

  const [selectedSize, setSelectedSize] = useState("")

  const { addToCart } = useCart()

  const handleSubmit = (e) => {
    e.preventDefault()
    addToCart({ ...product, size: selectedSize })
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!product && !loading) {
    return <NotFound />
  }

  return (
    <div className="w-[64rem] mx-auto">
      {product.image && (
        <div className="aspect-square bg-gray-200 mt-8">
          <img src={API_BASE + "/" + product.image} alt="" className="block w-full h-full object-cover object-center" />
        </div>
      )}
      <div className="py-12">
        <div>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{product.name}</h1>
          <p className="mt-2 text-xl text-gray-600">${product.price}</p>
          <p className="text-gray-600 mt-4">{product.description}</p>
        </div>
        <form onSubmit={handleSubmit} className="w-96">
          {product.sizes ? (
            <div className="flex gap-3">
              {product.sizes.map((s) => (
                <div key={s} className="flex-1">
                  <input
                    id={s}
                    type="radio"
                    name="size"
                    value={s}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={s}
                    key={s}
                    className="block px-6 py-3 border border-gray-200 outline outline-2 outline-transparent rounded text-center peer-checked:border-blue-500 peer-checked: peer-checked:outline-blue-500 cursor-pointer select-none"
                  >
                    {s}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">One size</p>
          )}
          <button className="w-full bg-gray-900 font-semibold text-white px-6 py-3 rounded hover:bg-gray-800 mt-4">
            Add To Cart
          </button>
        </form>
      </div>
    </div>
  )
}

export function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="group">
        <div className="aspect-square bg-gray-200">
          {product.image ? (
            <img src={API_BASE + "/" + product.image} alt="" className="block w-full h-full object-cover" />
          ) : (
            <div className="text-5xl text-gray-400 h-full grid place-content-center opacity-50">
              <BiImage />
            </div>
          )}
        </div>
        <div className="mt-2">
          <h2 className="font-bold group-hover:underline">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
        </div>
      </div>
    </Link>
  )
}
