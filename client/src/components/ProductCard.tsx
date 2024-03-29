import { Link } from "react-router-dom"
import ProductImage from "./ProductImage"
import { useWishlist } from "../providers/WishlistProvider"
import { BiHeart, BiSolidHeart } from "react-icons/bi"
import { Button } from "./ui/button"
import { Product } from "../routes/Product"

interface ProductCardProps {
  product: Product
  button?: JSX.Element | null
}

function ProductCardLikeButton({ product }) {
  const { toggleItemInWishlist, isItemInWishlist } = useWishlist()
  const isInWishlist = isItemInWishlist(product._id)

  return (
    <Button
      onClick={() => toggleItemInWishlist(product, null, 1)}
      variant="ghost"
      className="absolute z-0 top-2 right-2 w-10 h-10 p-0 text-xl text-gray-800"
    >
      {!isInWishlist ? <BiHeart /> : <BiSolidHeart />}
      <span className="sr-only">Add item to wishlist</span>
    </Button>
  )
}

export default function ProductCard({
  product,
  button = <ProductCardLikeButton product={product} />,
}: ProductCardProps) {
  return (
    <div className="relative">
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
      {button}
    </div>
  )
}
