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

  if (req.method === "PUT") {
    const { id, name, price, category, stock } = req.body;

    if (!id || (!name && !price && !category && !stock)) {
      return res
        .status(400)
        .json({ error: "ID and at least one field to update are required" });
    }

    try {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          ...(name && { name }),
          ...(price && { price: Number(price) }),
          ...(category && { category }),
          ...(stock && { stock: Number(stock) }),
        },
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
