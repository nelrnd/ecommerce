import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import useFetch from "../hooks/useFetch"
import { ProductCard } from "../components/Product"
import CategoryCard from "../components/CategoryCard"
import { Link } from "react-router-dom"

export default function Home() {
  const [products, pLoading] = useFetch("/product")
  const [categories, cLoading] = useFetch("/category")

  if (pLoading || cLoading) {
    return <p>Loading</p>
  }

  return (
    <div className="w-[64rem] m-auto">
      <section className="px-8 py-8">
        <header className="py-4">
          <div className="flex items-baseline justify-between">
            <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight mb-5">Categories</h2>
            <Link to="/category">
              <span className="text-gray-600 hover:underline">See All</span>
            </Link>
          </div>
        </header>
        {categories && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        )}
      </section>
      <section className="p-8">
        <header className="py-4">
          <div className="flex items-baseline justify-between">
            <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight mb-5">Latest</h2>
            <Link to="/latest">
              <span className="text-gray-600 hover:underline">See all</span>
            </Link>
          </div>
        </header>
        <Carousel>
          <CarouselContent>
            {products.map((p) => (
              <CarouselItem key={p._id} className="basis-1/3">
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  )
}
