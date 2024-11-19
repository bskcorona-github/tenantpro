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

  if (req.method === "POST") {
    const { quantity, productId, userId } = req.body;

    if (!quantity || !productId || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // 商品情報を取得して価格を計算
      const product = await prisma.product.findUnique({
        where: { id: Number(productId) },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const totalPrice = product.price * Number(quantity);

      // 注文を作成
      const order = await prisma.orderDetails.create({
        data: {
          quantity: Number(quantity),
          totalPrice,
          productId: Number(productId),
          userId: Number(userId),
        },
      });

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
