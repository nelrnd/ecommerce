import { createContext, useContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import axios from "../axios"

const WishlistContext = createContext(null)

export default function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [wishlistId, setWishlistId] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname

  function addItem(item) {
    redirectWrapper(async () => {
      const res = await axios.post(`/wishlist/${wishlistId}/item`, item)
      const items = res.data
      setItems(items)
    })
  }

  function removeItem(item) {
    redirectWrapper(async () => {
      const res = await axios.delete(`/wishlist/${wishlistId}/item/${item._id}`)
      const items = res.data
      setItems(items)
    })
  }

  function toggleAddItem(item) {
    const isAdded = checkIfAdded(item.product._id)
    if (!isAdded) {
      addItem(item)
    } else {
      removeItem(item)
    }
  }

  function updateItemSize(item, newSize) {
    redirectWrapper(async () => {
      const res = await axios.put(`/wishlist/${wishlistId}/item/${item._id}`, newSize)
      const items = res.data
      setItems(items)
    })
  }

  function redirectWrapper(fn) {
    if (!wishlistId) {
      return navigate(from)
    }
    fn()
  }

  function checkIfAdded(productId) {
    console.log(items)
    return !!items.find((item) => item.product._id === productId)
  }

  useEffect(() => {
    if (user) {
      setWishlistId(user.wishlist_id)
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
    toggleAddItem,
    updateItemSize,
    checkIfAdded,
  }

  return <WishlistContext.Provider value={contextValue}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  return useContext(WishlistContext)
}
