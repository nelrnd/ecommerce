import Layout, { ProductGrid } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { useLoaderData } from "react-router-dom"

export default function Latest() {
  const products = useLoaderData()

  return (
    <Layout>
      <header className="py-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Latest</h1>
      </header>
      <section>
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      </section>
    </Layout>
  )
}
