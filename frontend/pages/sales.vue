<template>
  <div class="container mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">売上レポート</h1>

    <!-- 総売上表示 -->
    <p v-if="totalSales !== null" class="text-lg font-semibold">
      総売上: ¥{{ totalSales.toLocaleString() }}
    </p>
    <p v-else class="text-lg font-semibold text-gray-500">総売上を取得中...</p>

    <!-- 絞り込みフォーム -->
    <form @submit.prevent="fetchFilteredSales">
      <label class="block mb-2">
        テナントID:
        <input v-model.number="tenantId" type="number" placeholder="全体" class="input" />
      </label>
      <label class="block mb-2">
        開始日:
        <input v-model="startDate" type="date" placeholder="全期間" class="input" />
      </label>
      <label class="block mb-2">
        終了日:
        <input v-model="endDate" type="date" placeholder="全期間" class="input" />
      </label>
      <button type="submit" class="btn">絞り込み</button>
    </form>

    <!-- 売上データ表示 -->
    <table class="table-auto mt-4 w-full" v-if="aggregatedSales.length > 0">
      <thead>
        <tr>
          <th class="border px-4 py-2">テナントID</th>
          <th class="border px-4 py-2">総額</th>
          <th class="border px-4 py-2">期間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in aggregatedSales" :key="sale.tenantId">
          <td class="border px-4 py-2">{{ sale.tenantId || "N/A" }}</td>
          <td class="border px-4 py-2">¥{{ (sale.totalAmount || 0).toLocaleString() }}</td>
          <td class="border px-4 py-2">
            {{ startDate || "全期間" }} ～ {{ endDate || "全期間" }}
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-lg text-gray-500">絞り込まれた売上データがありません。</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useSales } from "~/composables/useSales";
import type { FilteredSalesResponse } from "~/composables/useSales";

const { getTotalSales, getFilteredSales } = useSales();

const totalSales = ref<number | null>(null);
const filteredSales = ref<FilteredSalesResponse[]>([]);

const startDate = ref<string>("");
const endDate = ref<string>("");
const tenantId = ref<number | undefined>();

// 絞り込まれた売上を集計
const aggregatedSales = computed(() => {
  const salesMap: Record<number, number> = {};
  filteredSales.value.forEach((sale) => {
    salesMap[sale.tenantId] = (salesMap[sale.tenantId] || 0) + sale.totalAmount;
  });
  return Object.entries(salesMap).map(([tenantId, totalAmount]) => ({
    tenantId: Number(tenantId),
    totalAmount,
  }));
});

// 総売上取得
const fetchTotalSales = async () => {
  try {
    totalSales.value = await getTotalSales();
  } catch (error) {
    console.error("Error fetching total sales:", error);
    totalSales.value = 0; // エラー時のデフォルト値
  }
};

// フィルタリングされた売上取得
const fetchFilteredSales = async () => {
  try {
    filteredSales.value = await getFilteredSales({
      tenantId: tenantId.value,
      startDate: startDate.value,
      endDate: endDate.value,
    });
  } catch (error) {
    console.error("Error fetching filtered sales:", error);
    filteredSales.value = []; // エラー時のデフォルト値
  }
};

// 初回ロード時に総売上を取得
onMounted(async () => {
  await fetchTotalSales();
});
</script>


