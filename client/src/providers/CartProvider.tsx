import { createContext, useContext, useEffect, useState } from "react"
import axios from "../axios"
import { useAuth } from "./AuthProvider"

const CartContext = createContext(null)

interface cartItem {
  id: string
  productId: string
  quantity: number
  size?: string
}

const MAX_ITEM_QUANTITY = 5

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<cartItem[]>([])
  const [cartId, setCartId] = useState("")
  const { user } = useAuth()

  function openCart() {
    setIsOpen(true)
  }

  function closeCart() {
    setIsOpen(false)
  }

  async function addItem(item) {
    if (cartId) {
      try {
        const res = await axios.post(`/cart/${cartId}`, item)
        const items = res.data
        setItems(items)
        openCart()
        return Promise.resolve()
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function updateItemSize(item, newSize) {
    if (cartId) {
      try {
        const res = await axios.put(`/cart/${cartId}/item/${item._id}`, {
          slug: item.product.slug,
          size: newSize,
          quantity: item.quantity,
        })
        const items = res.data
        setItems(items)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function updateItemQuantity(item, newQuantity) {
    if (cartId) {
      try {
        const res = await axios.put(`/cart/${cartId}/item/${item._id}`, {
          slug: item.product.slug,
          size: item.size,
          quantity: newQuantity,
        })
        const items = res.data
        setItems(items)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function deleteItem(item) {
    if (cartId) {
      try {
        const res = await axios.delete(`/cart/${cartId}/item/${item._id}`)
        const items = res.data
        setItems(items)
      } catch (err) {
        console.log(err)
      }
    }
  }

  function getItem(item) {
    const sku = item.product.slug + "_" + item.size
    return items.find((cartItem) => cartItem.sku === sku)
  }

  useEffect(() => {
    if (user) {
      setCartId(user.cart_id)
    } else {
      setCartId("")
    }
  }, [user])

  useEffect(() => {
    if (cartId) {
      axios
        .get(`/cart/${cartId}`)
        .then((res) => {
          const items = res.data
          setItems(items)
        })
        .catch((err) => console.log(err))
    } else {
      setItems([])
    }
  }, [cartId])

  const contextValue = {
    isOpen,
    setIsOpen,
    items,
    openCart,
    closeCart,
    addItem,
    deleteItem,
    updateItemSize,
    updateItemQuantity,
    getItem,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
