import { Section } from "@/components/Layout"
import ProductImage from "@/components/ProductImage"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/providers/CartProvider"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { useForm } from "react-hook-form"
import { BiChevronRight, BiHeart, BiLoaderAlt, BiSolidHeart } from "react-icons/bi"
import { Link, useLoaderData } from "react-router-dom"
import { useState } from "react"
import { useWishlist } from "@/providers/WishlistProvider"
import axios from "../axios"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ProductCard from "@/components/ProductCard"

export interface Product {
  name: string
  slug: string
  price: number
  description?: string
  image?: string
  category?: string
  brand?: string
  sizes?: [string]
  created_at: number
  view_count: number
}

const MAX_ITEM_QUANTITY = 5

export async function loader({ params }) {
  const slug = params.slug

  const [product, similarProducts] = await Promise.all([
    axios.get(`/product/${slug}`),
    axios.get(`/product/${slug}/similar`),
  ])

  return { product: product.data, similarProducts: similarProducts.data }
}

export default function Product() {
  const { product } = useLoaderData()

  return (
    <>
      <Section>
        <ProductBreadcrumb product={product} />
        <div className="grid grid-cols-3 items-start gap-8">
          <div className="col-span-2">
            <ProductImage src={product.image} />
          </div>
          <div className="pt-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-xl text-gray-600">${product.price}</p>
            <p className="text-gray-600 mt-4">{product.description}</p>

            <ProductForm product={product} />
          </div>
        </div>
      </Section>

      <SimilarProducts />
    </>
  )
}

function ProductBreadcrumb({ product }) {
  if (!product || !product.category) return null

  return (
    <section className="mb-6">
      <ul className="w-fit rounded-xl flex gap-1 items-center">
        <li className="text-gray-600">
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <BiChevronRight className="text-lg text-gray-500" />
        <li className="text-gray-600">
          <Link to={`/category/${product.category.slug}`} className="hover:underline">
            {product.category.name}
          </Link>
        </li>
        <BiChevronRight className="text-lg text-gray-500" />
        <li>{product.name}</li>
      </ul>
    </section>
  )
}

function ProductForm({ product }) {
  const [loading, setLoading] = useState(false)
  const { addToCart, getItem } = useCart()

  const formSchema = z.object({
    size: product.sizes ? z.string().min(1, "Please select a size") : z.null(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: product.sizes ? "" : null,
    },
  })

  const size = form.watch("size")
  const item = getItem({ product: product, size: size })
  const maxReached = item && item.quantity >= MAX_ITEM_QUANTITY

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    await addToCart(product, values.size, 1)
    setLoading(false)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          {product.sizes && (
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange}>
                      <div className="flex gap-2 items-center">
                        {product.sizes.map((size) => (
                          <FormItem key={size} className="flex-1">
                            <FormControl>
                              <RadioGroupItem value={size} className="peer hidden" />
                            </FormControl>
                            <Button type="button" variant="outline" className="w-full" asChild>
                              <FormLabel className="cursor-pointer outline outline-2 outline-transparent peer-data-[state=checked]:outline-gray-800 peer-data-[state=checked]:hover:bg-white">
                                {size}
                              </FormLabel>
                            </Button>
                          </FormItem>
                        ))}
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit" className="w-full mt-4" disabled={maxReached || loading}>
            {loading ? (
              <BiLoaderAlt className="animate-spin" />
            ) : !maxReached ? (
              "Add To Cart"
            ) : (
              "Max number of item in cart"
            )}
          </Button>
        </form>
      </Form>

      <WishlistButton product={product} size={size} />
    </>
  )
}

function WishlistButton({ product, size }) {
  const { toggleItemInWishlist, isItemInWishlist } = useWishlist()

  const isInWishlist = isItemInWishlist(product._id)

  function handleClick() {
    toggleItemInWishlist(product, size, 1)
  }

  return (
    <Button onClick={handleClick} variant="outline" className="w-full mt-3">
      {!isInWishlist ? (
        <>
          <BiHeart className="mr-1" />
          Add To Wishlist
        </>
      ) : (
        <>
          <BiSolidHeart className="mr-1" />
          Remove From Wishlist
        </>
      )}
    </Button>
  )
}

function SimilarProducts() {
  const { similarProducts } = useLoaderData()

  return (
    <Section>
      <header className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">You may also like</h2>
      </header>
      <Carousel>
        <CarouselContent>
          {similarProducts.map((product) => (
            <CarouselItem key={product._id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Section>
  )
}
