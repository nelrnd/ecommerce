import { ProductGrid, Section } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoaderData, useNavigate } from "react-router-dom"
import axios from "../axios"

export async function loader({ request, params }) {
  const url = new URL(request.url)
  const sort = url.searchParams.get("sort")
  const endpoint = `/brand/${params.slug}${sort ? `?sort=${sort}` : ""}`
  const res = await axios.get(endpoint)
  return res.data
}

export default function Brand() {
  const brand = useLoaderData()
  const navigate = useNavigate()

  function handleChange(value: string) {
    navigate({ pathname: `/brand/${brand.slug}`, search: value === "latest" ? "" : `sort=${value}` })
  }

  return (
    <Section>
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{brand.name}</h1>
            <p className="mt-2 text-xl text-gray-600">
              {brand.products.length} {brand.products.length < 2 ? "item" : "items"}
            </p>
          </div>
          {brand.products.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm">Sort by</span>
              <Select defaultValue="latest" onValueChange={handleChange}>
                <SelectTrigger className="w-[11rem]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="latest" defaultChecked>
                    Latest
                  </SelectItem>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="price_asc">Price - low to high</SelectItem>
                  <SelectItem value="price_desc">Price - high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </header>
      <main>
        <ProductGrid>
          {brand.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      </main>
    </Section>
  )
}
