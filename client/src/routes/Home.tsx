import useFetch from "../hooks/useFetch"
import { ProductCard } from "../components/Product"

export default function Home() {
  const [products, loading] = useFetch("/product")

  if (loading) {
    return <p>Loading</p>
  }

  return (
    <div className="w-[64rem] m-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Home</h1>
      </header>
      <main className="p-8 pt-0">
        {products && (
          <div className="grid grid-cols-3 gap-4 gap-y-8">
            {products.map((p) => (
              <ProductCard key={products._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
