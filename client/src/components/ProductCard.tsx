import { Link } from "react-router-dom"
import ProductImage from "./ProductImage"
import { useWishlist } from "../providers/WishlistProvider"
import { BiHeart, BiSolidHeart } from "react-icons/bi"
import { Button } from "./ui/button"

function ProductCardLikeButton({ product }) {
  const { toggleItem, checkIfAdded } = useWishlist()
  const isAdded = checkIfAdded(product._id)

  return (
    <Button
      onClick={() => toggleItem(product, 1)}
      variant="ghost"
      className="absolute z-10 top-2 right-2 w-10 h-10 p-0 text-xl text-gray-800"
    >
      {!isAdded ? <BiHeart /> : <BiSolidHeart />}
      <span className="sr-only">Add item to wishlist</span>
    </Button>
  )
}

export default function ProductCard({ product, button = <ProductCardLikeButton product={product} /> }) {
  return (
    <div className="relative">
      {button}
      <Link to={`/product/${product.slug}`}>
        <div className="group">
          <div>
            <ProductImage src={product.image} />
          </div>
          <div className="mt-2">
            <h2 className="font-bold group-hover:underline break-words">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
