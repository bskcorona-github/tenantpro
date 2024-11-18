import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, email, name, role, password } = req.body;

    // バリデーション: 必須フィールドの確認
    if (!id || (!email && !name && !role && !password)) {
      return res
        .status(400)
        .json({ error: "ID and at least one field to update are required" });
    }

    try {
      // パスワードのハッシュ化（必要な場合）
      let hashedPassword;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // ユーザーの更新処理
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          ...(email && { email }),
          ...(name && { name }),
          ...(role && { role }),
          ...(password && { password: hashedPassword }),
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma 特有のエラーコード処理
        if (error.code === "P2025") {
          // P2025: 対象が見つからない場合のエラー
          return res.status(404).json({ error: "User not found" });
        }

        if (error.code === "P2002") {
          // P2002: 一意制約違反のエラー
          return res.status(409).json({ error: "Email already exists" });
        }
      }

      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
