import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { ownerId } = req.query;

    // バリデーション: 必須フィールドの確認
    if (!ownerId || isNaN(Number(ownerId))) {
      return res.status(400).json({ error: "Valid Owner ID is required" });
    }

    try {
      // 特定オーナーのテナント取得
      const tenants = await prisma.tenant.findMany({
        where: { ownerId: Number(ownerId) },
        include: {
          owner: { select: { id: true, name: true, email: true } },
        },
      });

      res.status(200).json(tenants);
    } catch (error) {
      console.error("Error fetching tenants by owner:", error);
      res.status(500).json({ error: "Failed to fetch tenants" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
