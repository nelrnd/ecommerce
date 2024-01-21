import { Link, useParams } from "react-router-dom"
import { BiImage } from "react-icons/bi"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"

const API_BASE = import.meta.env.VITE_API_BASE

export default function Product() {
  const { slug } = useParams()
  const [product] = useFetch(`/product/${slug}`)

  if (!product) {
    return <NotFound />
  }

  return (
    <div className="w-[64rem] m-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{product.name}</h1>
        <p className="mt-2 text-xl">${product.price}</p>
      </header>
      <main className="p-8 pt-0">{product.description}</main>
      <img src={API_BASE + "/" + product.image} alt="" />
    </div>
  )
}

export function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="aspect-square bg-gray-200">
        {product.image ? (
          <img src={API_BASE + "/" + product.image} alt="" className="block w-full h-full object-fill" />
        ) : (
          <div className="text-5xl text-gray-400 h-full grid place-content-center opacity-50">
            <BiImage />
          </div>
        )}
      </div>
      <div className="mt-2">
        <h2 className="font-bold">{product.name}</h2>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </Link>
  )
}
