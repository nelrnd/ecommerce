import { BiCheckCircle } from "react-icons/bi"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"

const order = {
  id: 81924789,
  email: "johnsmith@email.com",
}

export default function OrderConfirmation() {
  return (
    <div className="w-[40rem] max-w-full m-auto space-y-8">
      <section className="bg-white p-8 rounded-2xl border border-gray-200 space-y-8">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-center">
          <BiCheckCircle className="inline-block mr-2 -translate-y-0.5 text-indigo-600" />
          Thank you for your order!
        </h1>
        <div className="space-y-4">
          <p className="text-gray-600">
            We just sent you an email confirmation at:
            <br />
            <span className="text-black font-semibold">{order.email}</span>
          </p>
          <p className="text-gray-600">
            Your order number is:
            <br />
            <span className="text-black font-semibold">{order.id}</span>
          </p>
          <p className="text-gray-600">
            Your order will deliver on:
            <br />
            <span className="text-black font-semibold">Groawzy</span>
          </p>
        </div>
        <div className="w-fit m-auto">
          <Link to="/" className={buttonVariants()}>
            Continue shopping
          </Link>
        </div>
      </section>
    </div>
  )
}
