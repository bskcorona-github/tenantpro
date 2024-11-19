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
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: "ID and Name are required" });
    }

    try {
      const updatedTenant = await prisma.tenant.update({
        where: { id: Number(id) },
        data: { name },
      });

      res.status(200).json(updatedTenant);
    } catch (error) {
      console.error("Error updating tenant:", error);
      res.status(500).json({ error: "Failed to update tenant" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
