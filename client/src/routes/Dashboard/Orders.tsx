import { Link, useLoaderData } from "react-router-dom"
import axios from "../../axios"
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import { DataTable } from "@/components/ui/data-table"
import { formatPrice } from "@/utils"

type Order = {
  _id: string
  number: number
  customer: object
  nb_of_products: number
  total_price: number
  status: string
  date: number
}

export async function loader() {
  const orders = await axios.get("/order")
  return orders.data
}

export default function Orders() {
  const orders = useLoaderData()

  const tableOrders = orders?.map((order) => ({
    _id: order._id,
    number: order.number,
    customer: { name: order.first_name + " " + order.last_name, email: order.email },
    nb_of_products: order.products.reduce((acc, curr) => acc + curr.quantity, 0),
    total_price: order.products.reduce((acc, curr) => acc + curr.quantity * curr.product.price, 0),
    status: order.status,
    date: order.created_at,
  }))

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "number",
      header: "Number",
      cell: ({ row }) => {
        const number = row.getValue("number")
        return (
          <Link to={`/dashboard/order/${row.original._id}`} className="font-semibold hover:underline">
            {number ? "#" + number : ""}
          </Link>
        )
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer")
        return (
          <div>
            <p>{customer.name}</p>
            <p className="text-gray-600">{customer.email}</p>
          </div>
        )
      },
    },
    {
      accessorKey: "nb_of_products",
      header: "Number of products",
    },
    {
      accessorKey: "total_price",
      header: "Total price in $",
      cell: ({ row }) => <p>{formatPrice(row.getValue("total_price"))}</p>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div
            className={`px-2 py-1 rounded-full text-white font-medium w-fit ${
              status === "complete" ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <p>{moment(row.getValue("date")).format("MM/DD/YYYY")}</p>,
    },
  ]

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Orders</h1>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <DataTable columns={columns} data={tableOrders} search={false} />
      </section>
    </div>
  )
}
