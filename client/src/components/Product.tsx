import { Link, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BiImage, BiChevronRight } from "react-icons/bi"
import * as z from "zod"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"
import { useCart } from "../providers/CartProvider"
import { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Button } from "./ui/button"

const API_BASE = import.meta.env.VITE_API_BASE

export default function Product() {
  const { slug } = useParams()

  const [product, loading] = useFetch(`/product/${slug}`)

  if (loading) {
    return <p>Loading...</p>
  }

  if (!product && !loading) {
    return <NotFound />
  }

  return (
    <div className="w-[64rem] mx-auto">
      <Product_Breadcrumb product={product} />

      <div className="grid grid-cols-2 gap-8 items-start">
        {product.image && (
          <div className="aspect-square bg-gray-200">
            <img
              src={API_BASE + "/" + product.image}
              alt=""
              className="block w-full h-full object-cover object-center"
            />
          </div>
        )}
        <div className="py-8">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-xl text-gray-600">${product.price}</p>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>

          <Product_Form product={product} />
        </div>
      </div>
    </div>
  )
}

function Product_Form({ product }) {
  const { addToCart, items } = useCart()

  console.log(product)

  const formSchema = z.object({
    size: product.sizes ? z.string().min(1, "Please select a size") : z.null(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: product.sizes ? "" : null,
    },
  })

  const [max, setMax] = useState(false)
  const size = form.watch("size")

  useEffect(() => {
    setMax(items.find((i) => i._id === product._id && i.size === size)?.quantity >= 5)
  }, [size, items, product._id])

  function onSubmit(values: z.infer<typeof formSchema>) {
    addToCart({ ...product, ...values })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-96">
        {product.sizes && (
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                    <div className="flex gap-2 items-center">
                      {product.sizes.map((size) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <RadioGroupItem value={size} className="peer hidden" />
                          </FormControl>
                          <FormLabel className="block px-6 py-3 border border-gray-200 hover:bg-gray-200 rounded text-center font-normal cursor-pointer outline outline-2 outline-transparent peer-data-[state=checked]:outline-gray-900 peer-data-[state=checked]:hover:bg-white">
                            {size}
                          </FormLabel>
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

        <Button className="w-full mt-4" disabled={max}>
          {!max ? "Add To Cart" : "Max number of item in cart"}
        </Button>
      </form>
    </Form>
  )
}

function Product_Breadcrumb({ product }) {
  if (!product.category) return null

  return (
    <section className="py-6">
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

export function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`}>
      <div className="group">
        <div className="aspect-square bg-gray-200">
          {product.image ? (
            <img src={API_BASE + "/" + product.image} alt="" className="block w-full h-full object-cover" />
          ) : (
            <div className="text-5xl text-gray-400 h-full grid place-content-center opacity-50">
              <BiImage />
            </div>
          )}
        </div>
        <div className="mt-2">
          <h2 className="font-bold group-hover:underline">{product.name}</h2>
          <p className="text-gray-600">${product.price}</p>
        </div>
      </div>
    </Link>
  )
}
