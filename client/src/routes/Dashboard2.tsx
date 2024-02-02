import {
  BiChart,
  BiCube,
  BiGridAlt,
  BiLinkExternal,
  BiLogOut,
  BiPurchaseTag,
  BiSolidHome,
  BiDotsHorizontalRounded,
} from "react-icons/bi"
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "../axios"
import { useEffect } from "react"
import useFetch from "../hooks/useFetch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { formatPrice } from "../utils"
import { ProductImage } from "@/components/Product"
import { DataTable } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Products from "./Dashboard/Products"
import ProductForm from "./Dashboard/ProductForm"
import ProductDelete from "./Dashboard/ProductDelete"

type Product = {
  _id: string
  image: string | null
  name: string
  slug: string
  category: string
  price: number
}

function Dashboard_Products() {
  const [products, loading] = useFetch("/product")

  const tableProducts = products?.map((product) => ({
    _id: product._id,
    image: product.image,
    name: product.name,
    slug: product.slug,
    category: product.category?.name || null,
    price: product.price,
  }))

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const image = row.getValue("image")
        return <ProductImage src={image} className="w-10" />
      },
      autoWidth: true,
      enab,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original
        return (
          <Link to={`/product/${product.slug}`} className="font-semibold hover:underline">
            {product.name}
          </Link>
        )
      },
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const price = row.getValue("price")
        const formatted = formatPrice(price)
        return <div className="text-right">{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <BiDotsHorizontalRounded />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/product/${product.slug}/delete`}>
                  <span className="text-red-600">Delete</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (loading) return null

  return (
    <div>
      <header className="p-12 flex justify-between items-center gap-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Products</h1>
        <Link to="/dashboard/product/create" className={buttonVariants()}>
          Create a new product
        </Link>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <DataTable columns={columns} data={tableProducts} imgCol />
      </section>
    </div>
  )
}

const productFormSchema = z.object({
  name: z.string().min(3).max(200),
  price: z.coerce
    .number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
    .nonnegative(),
  description: z.string().min(3).max(1000).optional(),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
})

function Dashboard_ProductForm() {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  })

  const [categories] = useFetch("/category")
  const [brands] = useFetch("/brand")

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    console.log(values)
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Create product</h1>
      </header>
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
                    <Input {...field} />
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </section>
    </div>
  )
}

const categoryFormSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(3).max(200).optional(),
})

function Dashboard_CategoryForm() {
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  })

  function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    console.log(values)
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Create category</h1>
      </header>
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </section>
    </div>
  )
}

function Dashboard_CategoryDelete() {
  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Delete category</h1>
      </header>
    </div>
  )
}

type Brand = {
  _id: string
  name: string
  nbOfProducts: number
}

function Dashboard_Brands() {
  const [brands, loading] = useFetch("/brand")

  const tableBrands = brands?.map((brand) => ({
    _id: brand.brand._id,
    name: brand.brand.name,
  }))

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
  ]

  if (loading) return <p>Loading...</p>
  return (
    <div>
      <header className="p-12 flex justify-between items-center gap-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Brands</h1>
        <Link to="/dashboard/brand/create" className={buttonVariants()}>
          Create a new brand
        </Link>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <DataTable columns={columns} data={tableBrands} />
      </section>
    </div>
  )
}

const brandFormSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(3).max(200).optional(),
})

function Dashboard_BrandForm() {
  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
    },
  })

  const { slug } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()

  const title = slug ? "Update brand" : "Create brand"
  const btnText = slug ? "Update" : "Create"

  useEffect(() => {
    if (slug) {
      axios
        .get(`/brand/${slug}`)
        .then((res) => {
          const { brand } = res.data
          form.setValue("name", brand.name)
          form.setValue("description", brand.description)
        })
        .catch(() => navigate("/dashboard/brand/create"))
    }
  }, [slug, navigate, form])

  function onSubmit(values: z.infer<typeof brandFormSchema>) {
    const method = slug ? "put" : "post"
    const endpoint = slug ? `/brand/${slug}` : "/brand"
    const toastText = slug ? "New brand successfully created." : "Brand successfully updated."

    axios[method](endpoint, values)
      .then((res) => {
        toast({ title: "Success!", description: toastText })
        if (!slug) {
          navigate(`/dashboard/brand/${res.data.slug}`)
        }
      })
      .catch(() =>
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
      )
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{title}</h1>
      </header>
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

            <Button type="submit">{btnText}</Button>
          </form>
        </Form>
      </section>
    </div>
  )
}

function Dashboard_BrandDelete() {
  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Delete brand</h1>
      </header>
    </div>
  )
}
