import { useParams } from "react-router-dom"
import { Spinner, Heading, Text } from "@chakra-ui/react"
import useFetch from "../hooks/useFetch"
import NotFound from "./NotFound"

export default function Product() {
  const { slug } = useParams()
  const [product, loading] = useFetch(`/product/${slug}`)

  if (loading) {
    return <Spinner />
  }

  if (!product) {
    return <NotFound />
  }

  return (
    <>
      <Heading>{product.name}</Heading>
      <Text as="b">${product.price}</Text>
      <Text>{product.description}</Text>
    </>
  )
}
