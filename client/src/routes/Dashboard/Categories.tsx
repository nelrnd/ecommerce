import { ColumnDef } from "@tanstack/react-table"
import useFetch from "../../hooks/useFetch"
import { ProductImage } from "../../components/Product"
import { Button, buttonVariants } from "@/components/ui/button"
import { BiDotsHorizontalRounded, BiSortAlt2 } from "react-icons/bi"
import { Link } from "react-router-dom"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

type Category = {
  _id: string
  image: string | null
  name: string
  slug: string
  nbOfProducts: number
}

export default function Categories() {
  const [categories, loading] = useFetch("/category")

  if (loading) return null

  const tableCategories = categories?.map((category) => ({
    _id: category._id,
    image: category.image,
    name: category.name,
    slug: category.slug,
    nbOfProducts: category.nb_of_products,
  }))

  const columns: ColumnDef<Category>[] = [
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
        <Link to={`/category/${row.original.slug}`} className="font-semibold hover:underline">
          {row.original.name}
        </Link>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "nbOfProducts",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Number of products
            <BiSortAlt2 className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="pl-4">{row.getValue("nbOfProducts")}</div>,
      sortingFn: "alphanumeric",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original

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
                <Link to={`/dashboard/category/${category.slug}`} className="cursor-pointer">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/category/${category.slug}/delete`} className="cursor-pointer">
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
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Categories</h1>
        <Link to="/dashboard/category/create" className={buttonVariants()}>
          Create a new category
        </Link>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <DataTable columns={columns} data={tableCategories} />
      </section>
    </div>
  )
}
