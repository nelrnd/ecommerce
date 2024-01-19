import { Box, Grid, Heading, Spinner } from "@chakra-ui/react"
import useFetch from "../hooks/useFetch"
import ProductCard from "../components/ProductCard"

export default function Home() {
  const [products, loading] = useFetch("/product")

  if (loading) {
    return <Spinner />
  }

  return (
    <Box>
      <Heading>Home</Heading>
      {products && (
        <Grid templateColumns="repeat(4, 1fr)" gap="4">
          {products.map((p) => (
            <ProductCard key={products._id} product={p} />
          ))}
        </Grid>
      )}
    </Box>
  )
}
