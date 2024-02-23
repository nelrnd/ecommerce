import { createContext, useContext, useEffect, useState } from "react"
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
  const [items, setItems] = useState<cartItem[]>([])
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
      if (!cartId) await setCartId()
      const endpoint = `/cart/${cartId}`
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

  async function updateItem(item: CartItem, newSize, newQuantity) {
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

  async function setCartId() {
    let cartId

    if (user) {
      cartId = user.cart_id
    } else if (localStorage.getItem("cartId")) {
      cartId = localStorage.getItem("cartId")
    } else {
      const res = await axios.post("/cart")
      cartId = res.data._id
      localStorage.setItem("cartId", cartId)
    }

    setCartId_(cartId)
    return cartId
  }

  // remove user cartId when user log out
  useEffect(() => {
    if (!user) {
      setCartId_("")
    }
  }, [user])

  // set cart id to user cart id when user log in
  useEffect(() => {
    async function handleUserLogin() {
      if (user) {
        setCartId_(user.cart_id)
        // merge current cart with user cart when user log in
        const currentCartId = localStorage.getItem("cartId")
        if (currentCartId) {
          localStorage.removeItem("cartId")
          const res = await axios.post(`/cart/${user.cart_id}/merge`, { currentCartId: currentCartId })
          const items = res.data
          setItems(items)
        }
      }
    }
    handleUserLogin()
  }, [user])

  // fetch cart items when changing cart id
  useEffect(() => {
    async function fetchItems() {
      try {
        if (cartId) {
          const res = await axios.get(`/cart/${cartId}`)
          const items = res.data
          setItems(items)
        } else {
          setItems([])
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchItems()
  }, [cartId])

  // set cartId to local storage cartId if defined
  useEffect(() => {
    const savedCartId = localStorage.getItem("cartId")
    if (savedCartId) {
      setCartId_(savedCartId)
    }
  }, [])

  const contextValue = {
    isOpen,
    setIsOpen,
    items,
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
