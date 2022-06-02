import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  PopoverCloseButton,
  PopoverArrow,
  FormControl,
  ButtonGroup,
  Input,
  FormLabel,
  Spinner, Switch, PopoverBody,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  AddIcon,
  MinusIcon, InfoIcon,
} from "@chakra-ui/icons";
import FocusLock from "react-focus-lock";
import {
  ChangeEvent,
  ChangeEventHandler,
  forwardRef,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import {useRouter} from "next/router";
import {string} from "prop-types";

// eslint-disable-next-line react/display-name
const TextInput = forwardRef(
  (
    props: {
      id: string;
      placeholder: string;
      defaultValue: string;
      onChange: ChangeEventHandler<HTMLInputElement>;
    },
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <FormControl>
        <Input ref={ref} {...props} onChange={props.onChange} />
      </FormControl>
    );
  }
);

// @ts-ignore
const Form = ({ firstFieldRef, secondFieldRef, titleRef, onCancel }) => {
  const [options, setOptions] = useState(0);
  const [invalidFields, setInvalidFields] = useState(["poll-title", "option-1", "option-2"]);
  const [optionVals, setOptionVals] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitForm = async () => {
    setLoading(true);
    const title = titleRef.current.value;
    const options = optionVals;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, options }),
    };
    fetch("/api/new", requestOptions).then(response => response.json()).then((data) => {
      // @ts-ignore
      setLoading(false);
      // @ts-ignore
      const { pollId } = data;
      // show modal
      window.location.href = `/${pollId}`;
    }).catch(error => {
      console.log(error);
      setLoading(false);
      //show error modal
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;

    if (id != "poll-title") {
      setOptionVals({
        ...optionVals,
        [Number(id.split("-")[1]) - 1]: value,
      });
    }

    if (value.length > 0) {
      invalidFields.forEach((field) => {
        if (field === id) {
          console.log("removing invalid field", field);
          setInvalidFields(invalidFields.filter((field) => field !== id));
        }
      });
    } else {
      setInvalidFields([...invalidFields, id]);
    }
  };

  return (
    <Stack spacing={4} paddingTop={"1em"}>
      <FormControl>
        <FormLabel htmlFor="poll-title">Title</FormLabel>
        <Input
          ref={titleRef}
          id="poll-title"
          placeholder="Write a question here..."
          onChange={handleInputChange}
        />
      </FormControl>
      <FormLabel htmlFor="title">Options</FormLabel>
      <TextInput
        key={1}
        id={`option-${1}`}
        placeholder={`Option ${1}`}
        defaultValue=""
        ref={firstFieldRef}
        onChange={handleInputChange}
      />
      <TextInput
        key={2}
        id={`option-${2}`}
        placeholder={`Option ${2}`}
        defaultValue=""
        ref={secondFieldRef}
        onChange={handleInputChange}
      />
      {[...Array(options)].map((x, i) => (
        <TextInput
          key={i + 3}
          id={`option-${i + 3}`}
          placeholder={`Option ${i + 3}`}
          defaultValue=""
          onChange={handleInputChange}
        />
      ))}
      <ButtonGroup d="flex" justifyContent="flex-end">
        <Button
          colorScheme="green"
          onClick={() => {
            setOptions(options + 1);
            console.log(`adding option-${options + 3}`);
            setInvalidFields([...invalidFields, `option-${options + 3}`]);
          }}
        >
          <AddIcon />
        </Button>
        <Button
          colorScheme="red"
          disabled={options == 0}
          onClick={() => {
            if (options != 0) {
              setInvalidFields(
                invalidFields.filter((id) => id !== `option-${options + 2}`)
              );
              console.log(`removing option-${options + 2}`);
              setOptions(options - 1);
            }
          }}
        >
          <MinusIcon />
        </Button>
      </ButtonGroup>
      <FormLabel htmlFor="settings">Settings</FormLabel>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor='ip-check' mb='0' mr={'6px'}>
          Check IP
        </FormLabel>
        {/* TODO add ip check */}
        <Popover>
          {/*
          // @ts-ignore */}
          <PopoverTrigger>
            <InfoIcon cursor={"pointer"}/>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              The hash of the voter&apos;s IP will be logged and then compared against every subsequent voter to prevent double-voting.
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Switch ml={"10px"} id='email-alerts' colorScheme={"teal"}/>
      </FormControl>
      <ButtonGroup d="flex" justifyContent="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          isDisabled={invalidFields.length > 0}
          colorScheme="teal"
          onClick={() => submitForm()}
        >
          {loading ? <Spinner size="sm" /> : "Create"}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure();
  const {
    onOpen: onOpenPoll,
    onClose: onClosePoll,
    isOpen: isOpenPoll,
  } = useDisclosure();
  const firstFieldRef = useRef(null);
  const secondFieldRef = useRef(null);
  const titleRef = useRef(null);

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Link
            href="/"
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            LivePoll
          </Link>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Popover
            isOpen={isOpenPoll}
            initialFocusRef={titleRef}
            onOpen={onOpenPoll}
            onClose={onClosePoll}
            placement="right"
            closeOnBlur={false}
          >
            {/*
            // @ts-ignore */}
            <PopoverTrigger>
              <Button rightIcon={<AddIcon />} colorScheme="teal">
                New Poll
              </Button>
            </PopoverTrigger>
            <PopoverContent p={5}>
              <FocusLock returnFocus persistentFocus={false}>
                <PopoverArrow />
                <PopoverCloseButton />
                <Form
                  firstFieldRef={firstFieldRef}
                  secondFieldRef={secondFieldRef}
                  titleRef={titleRef}
                  onCancel={onClosePoll}
                />
              </FocusLock>
            </PopoverContent>
          </Popover>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            {/*
            // @ts-ignore */}
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "About",
    href: "about",
  },
  {
    label: "GitHub",
    href: "https://github.com/BNH440/live-poll",
  },
];
