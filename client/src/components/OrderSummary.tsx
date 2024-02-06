import { formatPrice } from "@/utils"
import { Separator } from "./ui/separator"
import ProductImage from "./ProductImage"

export default function OrderSummary({ title = "Summary", products, shippingMethod }) {
  const nbOfProducts = products.reduce((acc, curr) => acc + curr.quantity, 0)
  const itemsLengthText = nbOfProducts + " " + (nbOfProducts > 1 ? "items" : "item")
  const shippingPrice = shippingMethod === "standard" ? 0 : 10
  const subtotalPrice = products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
  const totalPrice = shippingPrice + subtotalPrice

  return (
    <aside>
      <header className="mb-8">
        <div className="flex justify-between items-baseline">
          <h2>{title}</h2>
          <p className="text-sm text-gray-600">{itemsLengthText}</p>
        </div>
      </header>
      <Separator />
      <main>
        {products.map((product) => (
          <OrderSummaryItem key={product._id + product.size} product={product} />
        ))}
      </main>
      <footer>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(shippingPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </footer>
    </aside>
  )
}

function OrderSummaryItem({ product }) {
  const price = product.price * product.quantity

  return (
    <div className="flex items-start gap-3">
      <div className="w-16">
        <ProductImage src={product.image} className="w-" />
      </div>
      <div>
        <h3>{product.name}</h3>
        <p>{formatPrice(price)}</p>
        <div className="flex gap-3">
          <span>{product.size ? `Size: ${product.size}` : "One size"}</span>
          <span>Quantity: {product.quantity}</span>
        </div>
      </div>
    </div>
  )
}
