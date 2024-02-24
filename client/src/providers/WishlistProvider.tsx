import { createContext, useContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../axios"
import { useAuth } from "./AuthProvider"
import { Product } from "../routes/Product"

const WishlistContext = createContext(null)

export default function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [wishlistId, setWishlistId] = useState("")

  const { user } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname

  async function addToWishlist(product: Product, size: string, quantity: number) {
    if (!wishlistId) return navigate("/login", { state: { from: from } })
    try {
      const endpoint = `/wishlist/${wishlistId}/item`
      const res = await axios.post(endpoint, { product, size, quantity })
      const items = res.data
      setItems(items)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  async function removeFromWishlist(itemId: string) {
    if (!wishlistId) return navigate("/login", { state: { from: from } })
    try {
      const endpoint = `/wishlist/${wishlistId}/item/${itemId}`
      const res = await axios.delete(endpoint)
      const items = res.data
      setItems(items)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  async function toggleItemInWishlist(product: Product, size: string, quantity: number) {
    if (!wishlistId) return navigate("/login", { state: { from: from } })
    try {
      const itemInWishlist = items.find((item) => item.product._id === product._id)
      if (!itemInWishlist) {
        addToWishlist(product, size, quantity)
      } else {
        removeFromWishlist(itemInWishlist._id)
      }
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  async function updateItemSize(itemId: string, newSize: string) {
    if (!wishlistId) return navigate("/login", { state: { from: from } })
    try {
      const endpoint = `/wishlist/${wishlistId}/item/${itemId}`
      const res = await axios.put(endpoint, { size: newSize })
      const items = res.data
      setItems(items)
      return Promise.resolve()
    } catch (err) {
      console.log(err)
      return Promise.reject()
    }
  }

  function isItemInWishlist(productId: string) {
    return !!items.find((item) => item.product._id === productId)
  }

  useEffect(() => {
    if (user) {
      setWishlistId(user.wishlist_id)
    } else {
      setWishlistId("")
    }
  }, [user])

  useEffect(() => {
    async function fetchItems() {
      try {
        if (wishlistId) {
          const res = await axios.get(`/wishlist/${wishlistId}`)
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
  }, [wishlistId])

  const contextValue = {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleItemInWishlist,
    updateItemSize,
    isItemInWishlist,
  }

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  return useContext(WishlistContext)
}
