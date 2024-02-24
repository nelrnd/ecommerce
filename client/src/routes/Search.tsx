import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "../axios"
import { ProductGrid, Section } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Search() {
  const [searchParams] = useSearchParams()
  const term = searchParams.get("term")
  const sort = searchParams.get("sort")
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const nbOfResultsText = results.length + " " + (results.length > 1 ? "products found" : "product found")

  useEffect(() => {
    if (term) {
      axios
        .get(`/search?term=${term}${sort ? "&sort=" + sort : ""}`)
        .then((res) => res.data)
        .then((results) => setResults(results))
        .catch((err) => console.log(err))
    } else {
      navigate("/")
    }
  }, [term, navigate, sort])

  function handleChange(value: string) {
    navigate(`/search?term=${term}${value ? "&sort=" + value : ""}`)
  }

  return (
    <Section className="h-full">
      {results.length > 0 ? (
        <>
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="scroll-m-20 text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Search results for "{term}"
                </h1>
                <p className="sm:mt-2 sm:text-xl text-gray-600">{nbOfResultsText}</p>
              </div>
              {results.length > 1 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm">Sort by</span>
                  <Select defaultValue="latest" onValueChange={handleChange}>
                    <SelectTrigger className="w-[11rem]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent
                      align="end"
                      ref={(ref) => {
                        if (!ref) return
                        ref.ontouchstart = (e) => {
                          e.preventDefault()
                        }
                      }}
                    >
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
              {results.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </ProductGrid>
          </main>
        </>
      ) : (
        <header className="f-full grid place-content-center">
          <p className="text-4xl font-semibold">No results for "{term}"</p>
        </header>
      )}
    </Section>
  )
}
