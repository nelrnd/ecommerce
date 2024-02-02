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

type Brand = {
  _id: string
  name: string
  slug: string
  nbOfProducts: number
}

export default function Brands() {
  const [brands, loading] = useFetch("/brand")

  if (loading) return null

  const tableBrands = brands?.map((brand) => ({
    _id: brand._id,
    image: brand.image,
    name: brand.name,
    slug: brand.slug,
    nbOfProducts: brand.nb_of_products,
  }))

  const columns: ColumnDef<Brand>[] = [
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
        <Link to={`/brand/${row.original.slug}`} className="font-semibold hover:underline">
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
        const brand = row.original

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
                <Link to={`/dashboard/brand/${brand.slug}`} className="cursor-pointer">
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/dashboard/brand/${brand.slug}/delete`} className="cursor-pointer">
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
