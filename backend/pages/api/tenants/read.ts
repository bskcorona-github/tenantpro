import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // すべてのテナント取得
      const tenants = await prisma.tenant.findMany({
        include: {
          owner: { select: { id: true, name: true, email: true } }, // オーナー情報を含める
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
