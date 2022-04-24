import type { NextPage } from "next";
import Nav from "./nav";
import {Container, Heading, Text} from "@chakra-ui/react";

const About: NextPage = () => {

  return (
    <>
      <Nav />
      <Container>
        <Heading>About</Heading>
        <Text>
          This is the about page.
        </Text>
      </Container>
    </>
  );
};

export default About;
