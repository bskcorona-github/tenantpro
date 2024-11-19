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

  if (req.method === "DELETE") {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    try {
      const deletedProduct = await prisma.product.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(deletedProduct);
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
