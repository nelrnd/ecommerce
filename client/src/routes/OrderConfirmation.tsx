import { BiCheckCircle } from "react-icons/bi"
import { buttonVariants } from "@/components/ui/button"
import { Link, Navigate, useLocation } from "react-router-dom"
import OrderSummary from "@/components/OrderSummary"
import moment from "moment"

export default function OrderConfirmation() {
  const location = useLocation()
  const order = location.state

  if (!order) {
    return <Navigate to="/" />
  }

  const creationTime = moment(order.created_at)
  const estimatedDeliveryDates =
    order.shipping_method === "standard"
      ? creationTime.add(5, "days").format("dddd, MMM D") + " - " + creationTime.add(6, "days").format("dddd, MMM D")
      : creationTime.add(2, "days").format("dddd, MMM D") + " - " + creationTime.add(3, "days").format("dddd, MMM D")

  return (
    <div className="min-h-screen bg-gray-100 px-2 md:px-4 py-8 lg:py-16">
      <div className="w-[40rem] max-w-full m-auto space-y-8">
        <section className="bg-white px-4 md:px-8 py-8 rounded-xl border border-gray-200 space-y-6 md:space-y-8">
          <h1 className="scroll-m-20 flex flex-col gap-2 items-center md:block text-2xl md:text-3xl font-semibold tracking-tight text-center">
            <BiCheckCircle className="inline-block mr-2 -translate-y-0.5 text-indigo-600" />
            <span>Thank you for your order!</span>
          </h1>
          <div className="space-y-4">
            <p className="text-gray-600">
              We just sent you an email confirmation at:
              <br />
              <span className="text-black font-medium">{order.email}</span>
            </p>
            <p className="text-gray-600">
              Your order number is:
              <br />
              <span className="text-black font-medium">#{order.number}</span>
            </p>
            <p className="text-gray-600">
              Your order will deliver on:
              <br />
              <span className="text-black font-medium">{estimatedDeliveryDates}</span>
            </p>
            <p className="text-gray-600">
              to the address:
              <br />
              <span className="text-black font-medium">
                {order.address}
                <br />
                {order.city}, {order.zip_code} {order.country}
              </span>
            </p>
          </div>
          <div className="w-fit m-auto">
            <Link to="/" className={buttonVariants()}>
              Continue shopping
            </Link>
          </div>
        </section>

        <OrderSummary title="Order summary" items={order.products} shippingMethod={order.shipping_method} />
      </div>
    </div>
  )
}
