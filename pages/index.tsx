import type { NextPage } from "next";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
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
import {MutableRefObject, useEffect, useRef, useState} from "react";
import { useRouter } from "next/router";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../firebase";

const Home: NextPage = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const db = getDatabase(app);
  const firstPinRef = useRef() as MutableRefObject<HTMLInputElement>;

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
          firstPinRef.current.focus();
        }
      });
    }
  }, [value]);

  return (
    <>
      <Nav />
      <Container>
        <VStack paddingTop={"1em"}>
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
          <Center maxW="container.md">
            <HStack>
              <Text>Poll ID</Text>
              <PinInput type="alphanumeric" value={value} onChange={setValue} placeholder={"0"}>
                <PinInputField ref={firstPinRef}/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
                <PinInputField/>
              </PinInput>
              <Button colorScheme="blue">
                {loading ? <Spinner size="sm" /> : "Go"}
              </Button>
            </HStack>
          </Center>
        </VStack>
      </Container>
    </>
  );
};

export default Home;
