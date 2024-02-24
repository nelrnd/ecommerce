import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useCart } from "@/providers/CartProvider"
import { useWishlist } from "@/providers/WishlistProvider"
import ProductCard from "./ProductCard"
import { Button } from "./ui/button"
import { BiTrash } from "react-icons/bi"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useEffect } from "react"

export default function WishlistItem({ item }) {
  const { addToCart } = useCart()
  const { updateItemSize, removeFromWishlist } = useWishlist()

  const formSchema = z.object({
    size: item.product.sizes ? z.string().min(1, "Please select a size") : z.null(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: item.product.sizes ? item.size : null,
    },
  })

  const size = form.watch("size")

  useEffect(() => {
    if (size !== item.size) {
      updateItemSize(item._id, size)
    }
  }, [size, item, updateItemSize])

  function onSubmit(values: z.infer<typeof formSchema>) {
    addToCart(item.product, values.size, item.quantity)
    removeFromWishlist(item._id)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <ProductCard product={item.product} button={<DeleteButton itemId={item._id} />} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-2">
          {item.product.sizes ? (
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={item.size || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {item.product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <FormMessage />
                  </Select>
                </FormItem>
              )}
            />
          ) : (
            <p className="text-gray-600 text-center p-2">One size available</p>
          )}

          <Button type="submit" variant="secondary" className="w-full">
            Add To Cart
          </Button>
        </form>
      </Form>
    </div>
  )
}

interface DeleteButtonProps {
  itemId: string
}

function DeleteButton({ itemId }: DeleteButtonProps) {
  const { removeFromWishlist } = useWishlist()

  return (
    <Button
      onClick={() => removeFromWishlist(itemId)}
      variant="ghost"
      className="absolute z-10 top-2 right-2 w-10 h-10 p-0 text-xl text-gray-800"
    >
      <BiTrash />
      <span className="sr-only">Remove item from wishlist</span>
    </Button>
  )
}
