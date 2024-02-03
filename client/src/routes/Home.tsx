import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import useFetch from "../hooks/useFetch"
import { ProductCard } from "../components/Product"
import CategoryCard from "../components/CategoryCard"
import { Link } from "react-router-dom"
import Layout, { Section } from "@/components/Layout"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import axios from "../axios"

export default function Home() {
  return (
    <div>
      <CategoriesSection />
      <LatestProductsSection />
      <NewsletterSection />
    </div>
  )
}

function CategoriesSection() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await Promise.all([axios.get("/category/t-shirts-1"), axios.get("/category/jackets")])
      setCategories(categoryData.map((res) => res.data))
    }
    fetchCategories()
  }, [])

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
  const [products] = useFetch("/product?limit=5")

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
        {products && (
          <Carousel>
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product._id} className="basis-1/3">
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
      <div className="bg-gray-950 text-white pt-24 pb-28 text-center space-y-6 rounded-xl border border-gray-500">
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
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
                Subscribe
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Section>
  )
}

/*





    <Layout>
      <section className="mt-8">
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
      <section className="mt-8">
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
      <NewsletterSection />
    </Layout>
  )
}



function NewsletterSection() {
  

  return (
    <section className="py-32 text-center space-y-6 bg-black rounded-xl shadow text-white my-8">

    </section>
  )
}
*/
