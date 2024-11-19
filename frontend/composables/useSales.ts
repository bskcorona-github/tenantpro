// composables/useSales.ts
import { useRuntimeConfig } from "#app";

export interface Sale {
  id: number;
  tenantId: number;
  totalAmount: number; // totalAmount を追加
  date: string;
}

export const useSales = () => {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;

  // 売上データを取得
  const getSales = async (startDate?: string, endDate?: string): Promise<Sale[]> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const data: Sale[] = await $fetch(`${apiBaseUrl}/sales?${params.toString()}`);
      return data;
    } catch (error) {
      console.error("Error fetching sales:", error);
      return [];
    }
  };

  return { getSales };
};
