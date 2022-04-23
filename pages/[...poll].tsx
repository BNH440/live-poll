import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {app} from "./firebase";
import {child, get, getDatabase, onValue, ref} from "firebase/database";
import {useEffect, useRef, useState} from "react";
import {Bar} from "react-chartjs-2";
import { Container, VStack } from '@chakra-ui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  BarElement
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  BarElement
);
import Nav from "./nav";
import { useRouter } from 'next/router'

const Poll: NextPage = () => {
  const router = useRouter()
  const {poll} = router.query
  const db = getDatabase(app);
  // const [votes, setVotes] = useState({"0": 0, "1": 0});
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(
  {
    labels: ["Choice 1", "Choice 2"],
      datasets: [{
    data: [0, 0],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
  });

  useEffect(() => {
    if (poll != null && poll[0] != undefined) {
      const votesRef = ref(db, `/polls/${poll[0]}/votes/`);
      onValue(votesRef, (snapshot) => {
        const data = snapshot.val();
        setData({
          labels: ["Choice 1", "Choice 2"],
          datasets: [{
            data: [data["0"], data["1"]],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        })
      });
    }
  }, [poll != null && poll[0] != undefined])

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <>
    <Nav/>
    <VStack>
      <Container maxW='container.md' bg="white" borderRadius="10px">
        <Bar data={data}/>
      </Container>
    </VStack>
    </>
  )
}

export default Poll
