import { formatPrice } from "@/utils"
import { Separator } from "./ui/separator"
import ProductImage from "./ProductImage"

export default function OrderSummary({ title = "Summary", items, shippingMethod }) {
  const nbOfitems = items.reduce((acc, curr) => acc + curr.quantity, 0)
  const itemsLengthText = nbOfitems + " " + (nbOfitems > 1 ? "items" : "item")
  const shippingPrice = shippingMethod === "standard" ? 0 : 10
  const subtotalPrice = items.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0)
  const totalPrice = shippingPrice + subtotalPrice

  return (
    <aside className="bg-white px-4 md:px-8 py-8 rounded-xl border border-gray-200 space-y-6">
      <header>
        <div className="flex justify-between items-baseline">
          <h2 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-gray-600">{itemsLengthText}</p>
        </div>
      </header>
      <Separator />
      <main className="space-y-4">
        {items.map((item) => (
          <OrderSummaryItem key={item.product._id + item.size} item={item} />
        ))}
      </main>
      <footer className="pt-2 space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(shippingPrice)}</span>
        </div>
        <Separator />
        <div className="font-semibold text-lg flex justify-between">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </footer>
    </aside>
  )
}

function OrderSummaryItem({ item }) {
  const { product } = item
  const price = product.price * item.quantity

  return (
    <div className="flex items-center gap-3">
      <div className="w-16">
        <ProductImage src={product.image} className="w-" />
      </div>
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm">{formatPrice(price)}</p>
        <div className="text-sm text-gray-600 flex gap-3">
          <span>{item.size ? `Size: ${item.size}` : "One size"}</span>
          <span>Quantity: {item.quantity}</span>
        </div>
      </div>
    </div>
  )
}
