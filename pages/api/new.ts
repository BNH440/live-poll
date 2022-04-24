import type { NextApiRequest, NextApiResponse } from 'next'
import admin from './firebase'
const db = admin.database();

type Data = {
  success: boolean,
  pollId: number | null,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>((resolve, reject) => {
    const pollId = Math.floor(100000 + Math.random() * 900000);
    const pollRef = db.ref(`polls/${pollId}`);
    pollRef.set({
      title: req.body.title,
      options: req.body.options,
      votes: new Array(Object.keys(req.body.options).length).fill(0),
      createdAt: Date.now(),
    }).then(() => {
      res.status(200).json({ success: true, pollId });
      resolve();
    }).catch((error) => {
      res.status(500).json({ success: false, pollId: null });
      reject(error);
    });
  });
}
