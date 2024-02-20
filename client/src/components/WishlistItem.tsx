import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useCart } from "@/providers/CartProvider"
import { useWishlist } from "@/providers/WishlistProvider"
import ProductCard from "./ProductCard"
import { Button } from "./ui/button"
import { BiTrash } from "react-icons/bi"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const formSchema = z.object({
  size: z.string(),
})

export default function WishlistItem({ item }) {
  const { addItem } = useCart()
  const { removeItem } = useWishlist()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    addItem(item)
    removeItem(item)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <ProductCard product={item.product} button={<DeleteButton itemId={item._id} />} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-2">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hello">Hello</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

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
  const { removeItem } = useWishlist()

  return (
    <Button
      onClick={removeItem.bind(itemId)}
      variant="ghost"
      className="absolute z-10 top-2 right-2 w-10 h-10 p-0 text-xl text-gray-800"
    >
      <BiTrash />
      <span className="sr-only">Remove item from wishlist</span>
    </Button>
  )
}
