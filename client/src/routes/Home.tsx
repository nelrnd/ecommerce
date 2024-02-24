import { Link, useLoaderData } from "react-router-dom"
import * as z from "zod"
import { useForm } from "react-hook-form"
import ProductCard from "../components/ProductCard"
import CategoryCard from "../components/CategoryCard"
import { Section } from "../components/Layout"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../components/ui/form"
import axios from "../axios"

export async function loader() {
  const [category1, category2, latestProducts] = await Promise.all([
    axios.get("/category/t-shirts-1"),
    axios.get("/category/jackets"),
    axios.get("/product?limit=5"),
  ])

  return { categories: [category1.data, category2.data], latestProducts: latestProducts.data }
}

export default function Home() {
  return (
    <>
      <CategoriesSection />
      <LatestProductsSection />
      <NewsletterSection />
    </>
  )
}

function CategoriesSection() {
  const { categories } = useLoaderData()

  return (
    <Section>
      <header className="mb-6">
        <div className="flex justify-between items-baseline">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Categories</h2>
          <Link to="/category" className="text-gray-600 hover:underline">
            See all
          </Link>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </main>
    </Section>
  )
}

function LatestProductsSection() {
  const { latestProducts } = useLoaderData()

  return (
    <Section>
      <header className="mb-6">
        <div className="flex justify-between items-baseline">
          <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">Latest</h2>
          <Link to="/latest" className="text-gray-600 hover:underline">
            See all
          </Link>
        </div>
      </header>
      <main>
        {latestProducts && (
          <Carousel>
            <CarouselContent>
              {latestProducts.map((product) => (
                <CarouselItem key={product._id} className="sm:basis-1/2 md:basis-1/3">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </main>
    </Section>
  )
}

function NewsletterSection() {
  const formSchema = z.object({
    email: z.string().min(1, "Email is required").email("This is not a valid email"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  }

  return (
    <Section>
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 text-white pt-24 pb-28 text-center space-y-6 rounded-xl border border-gray-500">
        <h3 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Subscribe to our newsletter</h3>
        <p className="max-w-[28rem] m-auto text-gray-400">
          Discover our latest releases and major sales firsthand. Sign up now for free weekly styling guides,
          exclusively for you. Elevate your fashion game effortlessly! ✨
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="m-auto w-fit flex items-start space-x-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your email" {...field} className="bg-transparent border-gray-700" />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <Button type="submit">Subscribe</Button>
            </div>
          </form>
        </Form>
      </div>
    </Section>
  )
}
