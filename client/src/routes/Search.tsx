import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "../axios"
import { ProductGrid, Section } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"

export default function Search() {
  const [searchParams] = useSearchParams()
  const term = searchParams.get("term")
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const nbOfResultsText = results.length + " " + (results.length > 1 ? "products found" : "product found")

  useEffect(() => {
    if (term) {
      axios
        .get(`/search?term=${term}`)
        .then((res) => res.data)
        .then((results) => setResults(results))
        .catch((err) => console.log(err))
    } else {
      navigate("/")
    }
  }, [term, navigate])

  return (
    <Section className="h-full">
      {results.length > 0 ? (
        <>
          <header className="mb-8">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Search results for "{term}"</h1>
            <p className="mt-2 text-xl text-gray-600">{nbOfResultsText}</p>
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
