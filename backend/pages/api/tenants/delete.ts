import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    // バリデーション: 必須フィールドの確認
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    try {
      // テナントの削除
      const deletedTenant = await prisma.tenant.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(deletedTenant);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ error: "Tenant not found" });
      }
      console.error("Error deleting tenant:", error);
      res.status(500).json({ error: "Failed to delete tenant" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
