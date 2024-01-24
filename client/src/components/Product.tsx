import { Link, useParams } from "react-router-dom"
import { BiImage } from "react-icons/bi"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"
import { useCart } from "../providers/CartProvider"

const API_BASE = import.meta.env.VITE_API_BASE

export default function Product() {
  const { slug } = useParams()
  const [product, loading] = useFetch(`/product/${slug}`)

  const { addToCart } = useCart()

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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{product.name}</h1>
        <p className="mt-2 text-xl text-gray-600">${product.price}</p>
        <p className="text-gray-600 mt-4">{product.description}</p>
        <button
          onClick={() => addToCart(product)}
          className="bg-gray-900 w-96 font-semibold text-white px-6 py-3 rounded hover:bg-gray-800 mt-4"
        >
          Add To Cart
        </button>
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
