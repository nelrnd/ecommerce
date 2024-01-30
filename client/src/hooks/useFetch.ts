import { useEffect, useState } from "react"
import axios from "../axios.ts"

export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
      })
  }, [url])

  return [data, loading]
}
