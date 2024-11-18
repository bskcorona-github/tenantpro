import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, ownerId } = req.body;

    console.log("Request Body:", req.body);

    // バリデーション: 必須フィールドの確認
    if (!name || !ownerId) {
      return res.status(400).json({ error: "Name and Owner ID are required" });
    }

    try {
      // テナント作成
      const tenant = await prisma.tenant.create({
        data: {
          name,
          ownerId: Number(ownerId),
        },
      });

      res.status(201).json(tenant);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Prisma エラーコードの処理
        switch (error.code) {
          case "P2002":
            // 一意制約違反
            const target = error.meta?.target as string[] | undefined; // 型アサーション
            if (target && target.includes("ownerId_name")) {
              return res.status(409).json({
                error: "A tenant with this name already exists for this owner.",
              });
            } else {
              return res
                .status(409)
                .json({ error: "Tenant name must be unique." });
            }

          case "P2003":
            // 外部キー制約違反
            return res
              .status(400)
              .json({ error: "Invalid ownerId. User not found." });

          default:
            console.error("Prisma error:", error);
            break;
        }
      }

      // 予期しないエラーの処理
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Failed to create tenant" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
