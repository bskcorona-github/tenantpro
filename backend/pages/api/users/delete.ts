import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import Cors from "cors";

const prisma = new PrismaClient();

const cors = Cors({
  origin: "http://localhost:3000",
  methods: ["DELETE"],
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

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // ユーザー削除
      const deletedUser = await prisma.user.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return res.status(400).json({
            error: "User cannot be deleted because it is referenced by other data.",
          });
        }
      }

      console.error("Error deleting user:", JSON.stringify(error, null, 2));
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

