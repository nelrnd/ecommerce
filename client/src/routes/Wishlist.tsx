import { ProductGrid, Section } from "@/components/Layout"
import { useWishlist } from "../providers/WishlistProvider"
import WishlistItem from "../components/WishlistItem"

export default function Wishlist() {
  const { items } = useWishlist()

  return (
    <Section>
      <header className="mb-8">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight">Wishlist</h1>
      </header>
      <main>
        {items.length > 0 ? (
          <ProductGrid>
            {items.map((item) => (
              <WishlistItem key={item.product._id} item={item} />
            ))}
          </ProductGrid>
        ) : (
          <p className="md:text-lg text-gray-600">You have no products in your wishlist for now...</p>
        )}
      </main>
    </Section>
  )
}
