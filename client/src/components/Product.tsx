import { useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"

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
    </div>
  )
}

export function ProductCard({ product }) {
  return <h1>Product Card</h1>
}
