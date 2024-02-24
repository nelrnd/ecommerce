import { ProductGrid, Section } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { useLoaderData } from "react-router-dom"
import axios from "../axios"

export async function loader() {
  const res = await axios.get("/product")
  return res.data
}

export default function Latest() {
  const products = useLoaderData()

  return (
    <Section>
      <header className="mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Latest</h1>
      </header>
      <main>
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      </main>
    </Section>
  )
}
