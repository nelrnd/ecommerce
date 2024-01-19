import { Box, Heading, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`}>
      <Box>
        <Heading>{product.name}</Heading>
        <Text as="b">${product.price}</Text>
      </Box>
    </Link>
  )
}
