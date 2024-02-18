import { createContext, useContext, useEffect, useState } from "react"
import axios from "../axios"
import { useAuth } from "./AuthProvider"

const CartContext = createContext(null)

interface cartItem {
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

  async function addItem(item) {
    try {
      let newCartId = cartId
      if (!newCartId) {
        newCartId = await setCartId()
      }

      const res = await axios.post(`/cart/${newCartId}`, item)
      const items = res.data
      setItems(items)
      openCart()
      return Promise.resolve()
    } catch (err) {
      console.log(err)
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

  async function setCartId() {
    let cartId

    if (user) {
      cartId = user.cart_id
    } else {
      cartId = localStorage.getItem("cartId")
      if (!cartId) {
        const res = await axios.post("/cart")
        cartId = res.data._id
        localStorage.setItem("cartId", cartId)
      }
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
