import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Cors from "cors";

const prisma = new PrismaClient();

// CORS ミドルウェアの設定
const cors = Cors({
  origin: "http://localhost:3000", // フロントエンドのURLを指定
  methods: ["GET"], // 許可するHTTPメソッド
});

// ミドルウェア実行用ヘルパー関数の型定義を明確化
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, callback: (result?: unknown) => void) => void
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result?: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS ミドルウェアを実行
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    try {
      // すべてのテナントを取得
      const tenants = await prisma.tenant.findMany({
        include: {
          owner: true, // オーナー情報を含む
        },
      });

      res.status(200).json(tenants);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      res.status(500).json({ error: "Failed to fetch tenants" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
