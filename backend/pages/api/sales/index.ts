import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Prisma } from "@prisma/client";
import Cors from "cors";

const cors = Cors({
  origin: "http://localhost:3000",
  methods: ["GET"],
});

const prisma = new PrismaClient();

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const { method, query } = req;
  const { tenantId, startDate, endDate } = query;

  try {
    if (method === "GET") {
      // 全期間・全テナントの売上データを取得
      if (!startDate && !endDate && !tenantId) {
        const totalSales = await getTotalSales();
        return res.status(200).json(totalSales);
      }

      // テナント別、または期間別の売上データを取得
      const sales = await getFilteredSales(
        Number(tenantId),
        startDate as string,
        endDate as string
      );
      return res.status(200).json(sales);
    }

    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getFilteredSales(
  tenantId?: number,
  startDate?: string,
  endDate?: string
) {
  const where: Prisma.SaleWhereInput = {
    ...(tenantId && { tenantId }),
    ...(startDate && endDate
      ? { date: { gte: new Date(startDate), lte: new Date(endDate) } }
      : {}),
  };

  return prisma.sale.findMany({
    where,
    select: {
      id: true,
      tenantId: true,
      totalAmount: true,
      date: true,
    },
  });
}

async function getTotalSales() {
  const sales = await prisma.sale.findMany({
    select: {
      id: true,
      tenantId: true,
      totalAmount: true,
      date: true,
    },
  });
  return sales;
}
