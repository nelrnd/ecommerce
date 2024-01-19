import { Box, Center, Heading, Text } from "@chakra-ui/react"

export default function NotFound() {
  return (
    <Center minH="100vh">
      <Box textAlign="center">
        <Heading>404</Heading>
        <Text>Page not found</Text>
      </Box>
    </Center>
  )
}
