import type { NextApiRequest, NextApiResponse } from 'next'
import {useState} from "react";

type Poll = {
  name: string
  options: Array<string>
  values: Array<number>
}

let polls: Map<string, Poll> = useState(new Map());

type Data = {
  options: Array<string>
  values: Array<number>
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ options: [], values: [] })
}
