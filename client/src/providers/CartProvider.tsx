import { createContext, useCallback, useContext, useEffect, useState } from "react"
import axios from "../axios"
import { useAuth } from "./AuthProvider"
import { Product } from "../routes/Product"

const CartContext = createContext(null)

interface CartItem {
  _id: string
  sku: string
  product: string
  quantity: number
  size?: string
}

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [cartId, setCartId_] = useState("")

  const { user } = useAuth()

  function openCart() {
    setIsOpen(true)
  }

  function closeCart() {
    setIsOpen(false)
  }

  async function addToCart(product: Product, size: string, quantity: number) {
    try {
      let newCartId
      if (!cartId) {
        newCartId = await setCartId({ createNew: true })
      }
      const endpoint = `/cart/${newCartId || cartId}`
      const res = await axios.post(endpoint, { product, size, quantity })
      const items = res.data
      setItems(items)
      openCart()
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  async function removeFromCart(itemId: string) {
    try {
      if (!cartId) throw Error("No cart id")
      const endpoint = `/cart/${cartId}/item/${itemId}`
      const res = await axios.delete(endpoint)
      const items = res.data
      setItems(items)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  async function updateItem(item: CartItem, newSize: string | null, newQuantity: number | null) {
    try {
      if (!cartId) throw Error("No cart id")
      const endpoint = `/cart/${cartId}/item/${item._id}`
      const data = { slug: item.product.slug, size: newSize || item.size, quantity: newQuantity || item.quantity }
      const res = await axios.put(endpoint, data)
      const items = res.data
      setItems(items)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  async function updateItemSize(item: CartItem, newSize: string) {
    return updateItem(item, newSize, null)
  }

  async function updateItemQuantity(item: CartItem, newQuantity: number) {
    return updateItem(item, null, newQuantity)
  }

  function getItem(item: CartItem) {
    const sku = item.product.slug + "_" + item.size
    return items.find((cartItem) => cartItem.sku === sku)
  }

  const setCartId = useCallback(
    async (options) => {
      let cartId
      const storedCartId = localStorage.getItem("cartId")

      if (user) {
        cartId = user.cart_id
        if (storedCartId) {
          await axios.post(`/cart/${cartId}/merge`, { currentCartId: storedCartId })
          localStorage.removeItem("cartId")
        }
      } else if (storedCartId) {
        cartId = storedCartId
      } else {
        if (options.createNew) {
          const res = await axios.post("/cart")
          cartId = res.data._id
          localStorage.setItem("cartId", cartId)
        } else {
          cartId = ""
        }
      }

      setCartId_(cartId)
      return cartId
    },
    [user]
  )

  useEffect(() => {
    setCartId({ createNew: false })
  }, [setCartId])

  useEffect(() => {
    async function fetchItems() {
      try {
        if (cartId) {
          setItemsLoading(true)
          const res = await axios.get(`/cart/${cartId}`)
          const items = res.data
          setItems(items)
          setItemsLoading(false)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchItems()
  }, [cartId])

  const contextValue = {
    isOpen,
    setIsOpen,
    items,
    itemsLoading,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateItemSize,
    updateItemQuantity,
    getItem,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
