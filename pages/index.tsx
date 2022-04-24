import type { NextPage } from "next";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Container,
  HStack,
  PinInput,
  PinInputField,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Nav from "./nav";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../firebase";

const Home: NextPage = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = getDatabase(app);

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false });

  useEffect(() => {
    if (value.length == 6) {
      setLoading(true);
      get(ref(db, "/polls/" + value)).then((data) => {
        if (data.val()) {
          router.push("/" + value);
        } else {
          setLoading(false);
          setValue("");
          onOpen();
        }
      });
    }
  }, [value]);

  return (
    <>
      <Nav />
      <Container>
        <VStack>
          {isVisible ? (
          <Alert status="error" borderRadius={"10px"}>
            <AlertIcon />
            <AlertTitle mr={2}>Error</AlertTitle>
            <AlertDescription>
              Couldn&apos;t find that poll.
            </AlertDescription>
            <CloseButton
              position='absolute' right='8px' top='8px'
              onClick={onClose}
            />
          </Alert>
          ) : null}
          <Container maxW="container.md">
            <HStack>
              <Text>Poll ID</Text>
              <PinInput type="alphanumeric" value={value} onChange={setValue}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
              <Button colorScheme="blue">
                {loading ? <Spinner size="sm" /> : "Go"}
              </Button>
            </HStack>
          </Container>
        </VStack>
      </Container>
    </>
  );
};

export default Home;
