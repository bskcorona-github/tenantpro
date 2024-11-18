import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.body;

    // バリデーション: ID の確認
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    try {
      // 削除処理
      const deletedUser = await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(deletedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma 特有のエラーコード処理
        if (error.code === "P2025") {
          return res
            .status(404)
            .json({ error: "User not found or already deleted" });
        }
      }

      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
