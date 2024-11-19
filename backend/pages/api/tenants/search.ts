import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient ,Prisma} from "@prisma/client";
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
    const { name, ownerId } = req.query;

    try {
      const tenants = await prisma.tenant.findMany({
        where: {
          ...(name && { name: { contains: String(name), mode: "insensitive" } }as Prisma.StringFilter),

          ...(ownerId && { ownerId: Number(ownerId) }),
        },
      });

      res.status(200).json(tenants);
    } catch (error) {
      console.error("Error searching tenants:", error);
      res.status(500).json({ error: "Failed to search tenants" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
