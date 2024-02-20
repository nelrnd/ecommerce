import { createContext, useContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import axios from "../axios"

const WishlistContext = createContext(null)

export default function WishlistProvider({ children }) {
  const [items, setItems] = useState<string>([])
  const [wishlistId, setWishlistId] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname

  function addItem(product, size, quantity) {
    redirectWrapper(async () => {
      const res = await axios.post(`/wishlist/${wishlistId}/item`, { product, size, quantity })
      const items = res.data
      setItems(items)
    })
  }

  function removeItem(itemId) {
    redirectWrapper(async () => {
      const res = await axios.delete(`/wishlist/${wishlistId}/item/${itemId}`)
      const items = res.data
      setItems(items)
    })
  }

  // add item if not present, remove item if present
  function toggleItem(product, size, quantity) {
    const item = items.find((item) => item.product._id === product._id)

    if (!item) {
      addItem(product, quantity, size)
    } else {
      removeItem(item._id)
    }
  }

  function updateItemSize(itemId, newSize) {
    redirectWrapper(async () => {
      const res = await axios.put(`/wishlist/${wishlistId}/item/${itemId}`, newSize)
      const items = res.data
      setItems(items)
    })
  }

  function redirectWrapper(fn) {
    if (!wishlistId) {
      return navigate("/login", { state: { from: from } })
    }
    fn()
  }

  function checkIfAdded(productId) {
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
    addItem,
    removeItem,
    toggleItem,
    updateItemSize,
    checkIfAdded,
  }

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  return useContext(WishlistContext)
}
