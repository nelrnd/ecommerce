import { ProductImage } from "../../components/Product"
import { Button, buttonVariants } from "../../components/ui/button"
import { DataTable } from "../../components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import useFetch from "../../hooks/useFetch"
import { formatPrice } from "../../utils"
import { ColumnDef } from "@tanstack/react-table"
import { BiDotsHorizontalRounded, BiSortAlt2 } from "react-icons/bi"
import { Link } from "react-router-dom"

type Product = {
  _id: string
  image: string | null
  name: string
  slug: string
  category: string | null
  price: number
}

export default function Products() {
  const [products, loading] = useFetch("/product")

  if (loading) return null

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
      cell: ({ row }) => <ProductImage src={row.getValue("image")} className="w-10" />,
      autoWidth: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <BiSortAlt2 className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <Link to={`/product/${row.original.slug}`} className="font-semibold hover:underline">
          {row.original.name}
        </Link>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <div className="ml-auto w-fit">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="ml-auto"
            >
              Price
              <BiSortAlt2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => <div className="text-right pr-4">{formatPrice(row.getValue("price"))}</div>,
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-lg">
                <span className="sr-only">Open menu</span>
                <BiDotsHorizontalRounded />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/product/${product.slug}`} className="cursor-pointer">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/product/${product.slug}/delete`} className="cursor-pointer">
                  <span className="text-red-600">Delete</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      autoWidth: true,
    },
  ]

  return (
    <div>
      <header className="p-12 flex justify-between items-center gap-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Products</h1>
        <Link to="/dashboard/product/create" className={buttonVariants()}>
          Create a new product
        </Link>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <DataTable columns={columns} data={tableProducts} />
      </section>
    </div>
  )
}
