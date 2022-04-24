import type { NextApiRequest, NextApiResponse } from 'next'
import admin from './firebase'
const db = admin.database();

type Data = {
  success: boolean
  error: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>((resolve, reject) => {
    let id = req.query.id;
    let option: any = req.query.option;
    let voteRef = db.ref(`polls/${id}/votes/${option}`);

    voteRef.transaction((votes) => {
      if (votes >= 0) {
        votes++
      }
      else {
        throw Error("That choice doesn't exist");
      }
      return votes;
    }).then((r: any) => {
      res.status(200).json({success: true, error: r});
      resolve();
    }).catch((e: any) => {
      res.json(e);
      res.status(500).end();
      resolve();
    });
  });
}
