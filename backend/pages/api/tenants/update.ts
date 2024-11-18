import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, name } = req.body;

    // バリデーション: 必須フィールドの確認
    if (!id || !name) {
      return res.status(400).json({ error: "ID and Name are required" });
    }

    try {
      // テナント情報の更新
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
