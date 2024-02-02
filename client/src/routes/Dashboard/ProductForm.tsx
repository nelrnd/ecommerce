import useFetch from "../../hooks/useFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { BiShow } from "react-icons/bi"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import axios from "../../axios"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

const formSchema = z.object({
  id: z.string().optional(), // if editing existing product
  name: z.string().min(3).max(200),
  price: z.coerce
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .nonnegative(),
  description: z.string().min(3).max(1000).optional(),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  image: z.union([
    z.string(),
    z
      .instanceof(File)
      .refine((f) => f.size < 5242880, "Image should be less than 5 MB")
      .optional(),
  ]),
})

export default function ProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  })

  const { slug } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const heading = slug ? "Update product" : "Create product"
  const btnText = slug ? "Save" : "Submit"

  const [categories] = useFetch("/category")
  const [brands] = useFetch("/brand")

  useEffect(() => {
    if (slug) {
      axios
        .get(`/product/${slug}`)
        .then((res) => {
          const product = res.data
          form.setValue("name", product.name)
          form.setValue("price", product.price)
          form.setValue("description", product.description)
          form.setValue("category", product.category?._id)
          form.setValue("brand", product.brand?._id)
          form.setValue("image", product.image)
        })
        .catch((err) => {
          console.log(err)
          navigate("/dashboard/product/create")
        })
    }
  }, [slug, form, navigate])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const options = { headers: { "Content-Type": "multipart/form-data" } }

    const catchHandler = (err) => {
      console.log(err)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }

    if (slug) {
      axios
        .put(`/product/${slug}`, values, options)
        .then((res) => {
          navigate(`/dashboard/product/${res.data.slug}`)
          toast({
            title: "Success!",
            description: "Product was successfully saved.",
          })
        })
        .catch(catchHandler)
    } else {
      axios
        .post("/product", values, options)
        .then((res) => {
          form.reset()
          toast({
            title: "Success!",
            description: "New product successfully created.",
            action: (
              <ToastAction altText="open" onClick={() => navigate(`/dashboard/product/${res.data.slug}`)}>
                OPEN
              </ToastAction>
            ),
          })
        })
        .catch(catchHandler)
    }
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{heading}</h1>
      </header>
      {slug && (
        <section className="mx-12 mb-6">
          <Link
            to={`/product/${slug}`}
            className="p-4 w-fit bg-white border border-gray-200 rounded-xl flex items-center gap-2 shadow hover:bg-gray-50"
          >
            <BiShow className="text-lg" />
            /product/{slug}
          </Link>
        </section>
      )}
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[36rem] space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price <span className="text-gray-600 font-normal">(in $)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {categories && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {brands && (
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand._id} value={brand._id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">{btnText}</Button>
          </form>
        </Form>
      </section>
    </div>
  )
}
