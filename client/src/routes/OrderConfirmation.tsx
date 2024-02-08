import { BiCheckCircle } from "react-icons/bi"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"
import OrderSummary from "@/components/OrderSummary"
import moment from "moment"

const testOrder = {
  _id: "65c1edfca6b6da166e7242b8",
  number: 10002,
  first_name: "John",
  last_name: "Smith",
  email: "johnsmith@email.com",
  country: "France",
  address: "41 Rue du Louvre",
  city: "Paris",
  zip_code: "75000",
  phone_code: 33,
  phone: "631 22 42 51",
  shipping_method: "standard",
  products: [
    {
      product: {
        _id: "65bf47580476ea150103f71e",
        name: "Lambo",
        slug: "lambo",
        price: 40290,
        image: null,
        sizes: null,
        created_at: "2024-02-04T08:14:16.429Z",
        view_count: 23,
        __v: 0,
      },
      quantity: 1,
      _id: "65c1edfca6b6da166e7242b9",
    },
    {
      product: {
        _id: "65ad4a79c4ed3b0fcb48588c",
        name: "Stussy Basic Tee",
        slug: "stussy-basic-tee",
        price: 40,
        image: "images/1705866837743-stuss.webp",
        __v: 0,
        category: "65ad7267c8bc8a1ac7b2293b",
        description: "This is perfect",
        sizes: ["SMALL", "MEDIUM"],
        view_count: 11,
        created_at: "2024-02-06T08:30:42.046Z",
      },
      quantity: 2,
      size: "SMALL",
      _id: "65c1edfca6b6da166e7242ba",
    },
  ],
  created_at: "2024-02-06T08:29:48.831Z",
  __v: 0,
}

export default function OrderConfirmation() {
  const creationTime = moment(testOrder.created_at)
  const estimatedDeliveryDates =
    testOrder.shipping_method === "standard"
      ? creationTime.add(5, "days").format("dddd, MMM D") + " - " + creationTime.add(6, "days").format("dddd, MMM D")
      : creationTime.add(2, "days").format("dddd, MMM D") + " - " + creationTime.add(3, "days").format("dddd, MMM D")

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 lg:py-16">
      <div className="w-[40rem] max-w-full m-auto space-y-8">
        <section className="bg-white p-8 rounded-xl border border-gray-200 space-y-8">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">
            <BiCheckCircle className="inline-block mr-2 -translate-y-0.5 text-indigo-600" />
            Thank you for your order!
          </h1>
          <div className="space-y-4">
            <p className="text-gray-600">
              We just sent you an email confirmation at:
              <br />
              <span className="text-black font-medium">{testOrder.email}</span>
            </p>
            <p className="text-gray-600">
              Your order number is:
              <br />
              <span className="text-black font-medium">#{testOrder.number}</span>
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
                {testOrder.address}
                <br />
                {testOrder.city}, {testOrder.zip_code} {testOrder.country}
              </span>
            </p>
          </div>
          <div className="w-fit m-auto">
            <Link to="/" className={buttonVariants()}>
              Continue shopping
            </Link>
          </div>
        </section>

        <OrderSummary title="Order summary" items={testOrder.products} shippingMethod={testOrder.shipping_method} />
      </div>
    </div>
  )
}
