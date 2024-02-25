import { useLoaderData } from "react-router-dom"
import axios from "../../axios"
import OrderSummary from "@/components/OrderSummary"
import moment from "moment"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export async function loader({ params }) {
  const id = params.id
  const order = await axios.get(`/order/${id}`)
  return order.data
}

export default function Order() {
  const order = useLoaderData()

  const [status, setStatus] = useState(order.status)

  async function handleCheckChange(value: boolean) {
    const newStatus = value ? "complete" : "in progress"
    await axios.put(`/order/${order._id}`, { status: newStatus })
    setStatus(newStatus)
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Order #{order.number}</h1>
      </header>

      <div className="px-12 space-y-8">
        <section className="bg-white px-4 md:px-8 py-8 rounded-xl border border-gray-200 space-y-6">
          <div>
            <h4 className="font-bold">Customer</h4>
            <p>
              {order.first_name} {order.last_name}
              <br />
              {order.email}
              <br />+{order.phone_code} {order.phone}
            </p>
          </div>

          <div>
            <h4 className="font-bold">Order details</h4>
            <p>Created at {moment(order.created_at).format("MM/DD/YYYY")}</p>
            <p>Shipping method: {order.shipping_method}</p>
            <p>
              Status:{" "}
              <span
                className={`px-2 py-1 text-white font-medium rounded-full ${
                  status === "complete" ? "bg-green-600" : "bg-blue-600"
                }`}
              >
                {status}
              </span>
            </p>

            <div className="mt-2 space-x-2 flex items-center">
              <Switch id="complete" onCheckedChange={handleCheckChange} checked={status === "complete"} />
              <Label htmlFor="complete">Order is complete</Label>
            </div>
          </div>

          <div>
            <h4 className="font-bold">Address</h4>
            <p>
              {order.address}
              <br />
              {order.city}, {order.zip_code} {order.country}
            </p>
          </div>
        </section>
        <OrderSummary items={order.products} shippingMethod={order.shippingMethod} />
      </div>
    </div>
  )
}
