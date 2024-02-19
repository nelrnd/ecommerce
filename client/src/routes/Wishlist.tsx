import { ProductGrid, Section } from "@/components/Layout"
import { useWishlist } from "../providers/WishlistProvider"
import ProductCard from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { BiTrash } from "react-icons/bi"

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <Section>
      <header className="mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Wishlist</h1>
      </header>
      <main>
        {items.length > 0 ? (
          <ProductGrid>
            {items.map((item) => (
              <WishlistItem key={item.product._id} item={item} />
            ))}
          </ProductGrid>
        ) : (
          <p className="text-lg text-gray-600">You have no products in your wishlist for now...</p>
        )}
      </main>
    </Section>
  )
}

function WishlistItemDeleteButton({ item }) {
  const { removeItem } = useWishlist()

  return (
    <Button
      onClick={() => removeItem(item._id)}
      variant="ghost"
      className="absolute z-10 top-2 right-2 w-10 h-10 p-0 text-xl text-gray-800"
    >
      <BiTrash />
    </Button>
  )
}

function WishlistItem({ item }) {
  return (
    <div>
      <ProductCard product={item.product} button={<WishlistItemDeleteButton item={item} />} />
    </div>
  )
}
