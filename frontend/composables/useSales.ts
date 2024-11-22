import { useRuntimeConfig } from "#app";

export interface FilteredSalesResponse {
  tenantId: number;
  totalAmount: number;
}

export const useSales = () => {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;

  // 全期間の総売上を取得
  const getTotalSales = async (): Promise<number> => {
    try {
      // クエリなしで全売上データを取得
      const sales = await $fetch<FilteredSalesResponse[]>(`${apiBaseUrl}/sales`);
      // 売上総額を計算
      return sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    } catch (error) {
      console.error("Error fetching total sales:", error);
      return 0;
    }
  };

  // テナントIDや期間による売上の絞り込み
  const getFilteredSales = async (params: {
    tenantId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<FilteredSalesResponse[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.tenantId) queryParams.append("tenantId", params.tenantId.toString());
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);

      const data = await $fetch<FilteredSalesResponse[]>(
        `${apiBaseUrl}/sales?${queryParams.toString()}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching filtered sales:", error);
      return [];
    }
  };

  return { getTotalSales, getFilteredSales };
};
