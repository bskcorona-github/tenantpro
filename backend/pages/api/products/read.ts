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
    try {
      const products = await prisma.product.findMany({
        include: { tenant: true },
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
