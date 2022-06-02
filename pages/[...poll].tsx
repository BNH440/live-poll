import type { NextPage } from "next";
import { app } from "../firebase";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { Fragment, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Button,
  Center,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  VStack,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  BarElement
);
import Nav from "./nav";
import { useRouter } from "next/router";

const Poll: NextPage = () => {
  const router = useRouter();
  const { poll } = router.query;
  const db = getDatabase(app);

  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [title, setTitle] = useState("");
  const [data, setData] = useState([0, 0]);
  const [value, setValue] = useState("1");
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  async function vote() {
    if (poll == null) return;
    console.log(poll);
    const vote = Number(value) - 1;

    setLoading(true);

    const requestOptions = {
      method: "POST",
    };
    fetch(`/api/vote?id=${poll}&option=${vote}`, requestOptions)
      .then(() => {
        setLoading(false);
        setVoted(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        //show error modal
      });
  }

  useEffect(() => {
    console.log("update");
    if (poll != null && poll[0] != undefined) {
      get(ref(db, `polls/${poll[0]}/options`)).then((snapshot) => {
        console.log("set options to ", Object.values(snapshot.val()));
        setPollOptions(Object.values(snapshot.val()));
      });
      get(ref(db, `polls/${poll[0]}/title`)).then((snapshot) => {
        console.log("set title to ", snapshot.val());
        setTitle(snapshot.val());
      });
      const votesRef = ref(db, `/polls/${poll[0]}/votes/`);
      onValue(votesRef, (snapshot) => {
        const data = snapshot.val();
        setData(data);
      });
    }
  }, [poll != null && poll[0] != undefined]);

  return (
    <Fragment>
      <Nav />
      {title != "" ? (
        <VStack spacing={"2em"} paddingTop={"2em"}>
          <Container maxW={"container.md"}>
            <Heading textAlign={"center"}>{title}</Heading>
          </Container>
          {!voted ? (
            <Container maxW="fit-content" borderWidth="1px" borderRadius="lg">
              <VStack d="flex" justifyContent="center" padding={"1em"}>
                <RadioGroup value={value} onChange={setValue}>
                  <Stack spacing={0} direction="row">
                    {pollOptions.map((option, index) => {
                      return (
                        <Radio
                          key={index}
                          value={(index + 1).toString()}
                          name="poll"
                          colorScheme={"teal"}
                          padding={"1em"}
                        >
                          {option}
                        </Radio>
                      );
                    })}
                  </Stack>
                </RadioGroup>
                <Button onClick={() => vote()}>
                  {loading ? (
                    <Spinner size="lg" />
                  ) : (
                    "Vote"
                  )}
                </Button>
              </VStack>
            </Container>
          ) : null}
          {voted ? (
            <Container maxW="container.md" bg="white" borderRadius="10px">
              <Bar
                data={{
                  labels: pollOptions,
                  datasets: [
                    {
                      data: data,
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(255, 205, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(201, 203, 207, 0.2)",
                      ],
                      borderColor: [
                        "rgb(255, 99, 132)",
                        "rgb(255, 159, 64)",
                        "rgb(255, 205, 86)",
                        "rgb(75, 192, 192)",
                        "rgb(54, 162, 235)",
                        "rgb(153, 102, 255)",
                        "rgb(201, 203, 207)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Container>
          ) : null}
        </VStack>
      ) : (
        <>
          <Center>
            <Spinner size="xl" />
          </Center>
        </>
      )}
    </Fragment>
  );
};

export default Poll;
