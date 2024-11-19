<template>
    <div class="container mx-auto py-10">
      <h1 class="text-2xl font-bold mb-4">売上レポート</h1>
  
      <!-- 絞り込みフォーム -->
      <form @submit.prevent="fetchSales">
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
      <table class="table-auto mt-4 w-full">
        <thead>
          <tr>
            <th class="border px-4 py-2">売上ID</th>
            <th class="border px-4 py-2">テナントID</th>
            <th class="border px-4 py-2">総額</th>
            <th class="border px-4 py-2">日付</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td class="border px-4 py-2">{{ sale.id }}</td>
            <td class="border px-4 py-2">{{ sale.tenantId }}</td>
            <td class="border px-4 py-2">¥{{ (sale.totalAmount || 0).toLocaleString() }}</td>

            <td class="border px-4 py-2">{{ sale.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useSales } from "~/composables/useSales";
  import type { Sale } from "~/composables/useSales";
  
  const { getSales } = useSales();
  
  const sales = ref<Sale[]>([]);
  const startDate = ref<string>("");
  const endDate = ref<string>("");
  
  const fetchSales = async () => {
    sales.value = await getSales(startDate.value || undefined, endDate.value || undefined);
  };
  
  // 初回ロード時に全期間を取得
  onMounted(fetchSales);
  </script>
  
  <style>
  .input {
    display: block;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .table-auto {
    width: 100%;
    border-collapse: collapse;
  }
  .table-auto th,
  .table-auto td {
    border: 1px solid #ccc;
    padding: 0.5rem;
  }
  </style>
  