import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import Cors from "cors";
const cors = Cors({
    origin: "http://localhost:3000", // フロントエンドのURLを指定
    methods: ["GET", "POST", "PUT", "DELETE"], // 必要なメソッドを追加
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
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const { method, query } = req;
  const { ownerId, tenantId, startDate, endDate } = query;

  try {
    if (method === "GET") {
      if (ownerId) {
        const sales = await getSalesByOwner(Number(ownerId), startDate as string, endDate as string);
        return res.status(200).json(sales);
      }
      if (tenantId) {
        const sales = await getSalesByTenant(Number(tenantId), startDate as string, endDate as string);
        return res.status(200).json(sales);
      }
      if (startDate && endDate) {
        const sales = await getSalesByPeriod(startDate as string, endDate as string);
        return res.status(200).json(sales);
      }

      const totalSales = await getTotalSales();
      return res.status(200).json(totalSales);
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getSalesByOwner(ownerId: number, startDate?: string, endDate?: string) {
  const where: Prisma.SaleWhereInput = {
    tenant: { ownerId },
    ...(startDate && endDate
      ? { date: { gte: new Date(startDate), lte: new Date(endDate) } }
      : {}),
  };

  const sales = await prisma.sale.groupBy({
    by: ["tenantId"],
    _sum: { totalAmount: true },
    where,
  });

  const totalAmount = sales.reduce((acc, curr) => acc + (curr._sum?.totalAmount || 0), 0);
  return { totalAmount, sales };
}

async function getSalesByTenant(tenantId: number, startDate?: string, endDate?: string) {
  const where: Prisma.SaleWhereInput = {
    tenantId,
    ...(startDate && endDate
      ? { date: { gte: new Date(startDate), lte: new Date(endDate) } }
      : {}),
  };

  const sales = await prisma.sale.findMany({
    where,
    select: {
      id: true,
      totalAmount: true,
      date: true,
    },
  });

  return { tenantId, sales };
}

async function getSalesByPeriod(startDate: string, endDate: string) {
  const sales = await prisma.sale.findMany({
    where: {
      date: { gte: new Date(startDate), lte: new Date(endDate) },
    },
    select: {
      id: true,
      tenantId: true,
      totalAmount: true,
      date: true,
    },
  });

  return sales;
}

async function getTotalSales() {
  const total = await prisma.sale.aggregate({
    _sum: { totalAmount: true },
  });

  return { totalAmount: total._sum?.totalAmount || 0 };
}
