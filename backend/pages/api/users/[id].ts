import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Cors from "cors";

const prisma = new PrismaClient();
const cors = Cors({
  origin: "http://localhost:3000", // フロントエンドのURLを指定
  methods: ["GET", "POST", "PUT", "DELETE"], // 必要なメソッドを追加
});
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
  await runMiddleware(req, res, cors);

  if (req.method === "GET") {
    const { id } = req.query;

    // バリデーション: ID の確認
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "A valid ID is required" });
    }

    try {
      // ユーザー情報の取得
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          tenants: {
            // テナント情報を取得
            select: {
              id: true,
              name: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      // ユーザーが存在しない場合
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
