//import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    message: "データを取得!",
  });
}

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'GET') {
//         // GETリクエストの処理
//         res.status(200).json({ message: 'GET request successful' });
//     } else if (req.method === 'POST') {
//         // POSTリクエストの処理
//         res.status(200).json({ message: 'POST request successful' });
//     } else {
//         res.status(405).json({ message: 'Method not allowed' });
//     }
// }
