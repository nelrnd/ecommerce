import Layout, { ProductGrid } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoaderData, useNavigate } from "react-router-dom"

export default function Category() {
  const category = useLoaderData()
  const navigate = useNavigate()

  function handleChange(value: string) {
    navigate({ pathname: `/category/${category.slug}`, search: value === "latest" ? "" : `sort=${value}` })
  }

  return (
    <Layout>
      <header className="py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{category.name}</h1>
            <p className="mt-2 text-xl text-gray-600">
              {category.products.length} {category.products.length < 2 ? "item" : "items"}
            </p>
          </div>
          {category.products.length && (
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
      <section>
        <ProductGrid>
          {category.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      </section>
    </Layout>
  )
}
