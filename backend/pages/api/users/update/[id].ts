import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import Cors from "cors";

const prisma = new PrismaClient();
const cors = Cors({
  origin: "http://localhost:3000", // フロントエンドのURLを指定
  methods: ["PUT"], // 必要なメソッドを追加
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

  const { id } = req.query; // クエリパラメータからIDを取得

  if (req.method === "PUT") {
    const { email, name, role, password, tenants } = req.body;

    // バリデーション: 必須フィールドの確認
    if (!id || (!email && !name && !role && !password && !tenants)) {
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
          ...(tenants && {
            tenants: {
              set: tenants.map((tenant: { id: number; name: string }) => ({
                id: tenant.id,
              })), // 既存のテナントを関連付け
              create: tenants
                .filter((tenant: { id?: number }) => !tenant.id)
                .map((tenant: { name: string }) => ({
                  name: tenant.name,
                })), // 新しいテナントを作成
            },
          }),
        },
        include: {
          tenants: true, // 更新後のテナント情報を含める
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma 特有のエラーコード処理
        if (error.code === "P2025") {
          return res.status(404).json({ error: "User not found" });
        }

        if (error.code === "P2002") {
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
