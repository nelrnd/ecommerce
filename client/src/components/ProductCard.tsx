import { Link } from "react-router-dom"
import ProductImage from "./ProductImage"

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="group">
        <ProductImage src={product.image} />
        <div className="mt-2">
          <h2 className="font-bold group-hover:underline break-words">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
        </div>
      </div>
    </Link>
  )
}
