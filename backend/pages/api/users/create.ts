import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, name, role, password } = req.body;

    if (!email || !name || !role || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // パスワードをハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // ユーザー作成
      const user = await prisma.user.create({
        data: { email, name, role, password: hashedPassword },
      });

      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma エラーコード P2002 は一意制約違反を表します
        if (error.code === "P2002") {
          return res.status(409).json({ error: "Email already exists" });
        }
      }

      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
