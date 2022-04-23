import type { NextPage } from 'next'
import { Container, VStack } from '@chakra-ui/react'
import Nav from "./nav";

const Home: NextPage = () => {

  return (
    <>
    <Nav/><VStack>
      <Container maxW='container.md'>
        <p>index</p>
      </Container>
    </VStack>
    </>
  )
}

export default Home
