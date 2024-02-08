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
import { BiChevronRight } from "react-icons/bi"
import { Link, useLoaderData } from "react-router-dom"

interface Product {
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

export default function Product() {
  const product: Product = useLoaderData()

  return (
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
  const { addItem, openCart, getItem } = useCart()

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const item = { product: product, size: values.size, quantity: 1 }
    addItem(item)
    openCart()
  }

  return (
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
                          <FormLabel className="block px-6 py-3 border border-gray-200 hover:bg-gray-200 text-center font-normal rounded cursor-pointer outline outline-2 outline-transparent peer-data-[state=checked]:outline-gray-900 peer-data-[state=checked]:hover:bg-white">
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
        <Button type="submit" className="w-full mt-4" disabled={maxReached}>
          {!maxReached ? "Add To Cart" : "Max number of item in cart"}
        </Button>
      </form>
    </Form>
  )
}
