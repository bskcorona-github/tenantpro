<template>
  <div class="container mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">注文管理</h1>

    <!-- 注文作成フォーム -->
    <form @submit.prevent="addOrder">
      <input v-model.number="newOrder.productId" type="number" placeholder="商品ID" class="input mb-2" />
      <input v-model.number="newOrder.quantity" type="number" placeholder="数量" class="input mb-2" />
      <input v-model.number="newOrder.userId" type="number" placeholder="ユーザーID" class="input mb-2" />
      <button type="submit" class="btn">注文を追加</button>
    </form>

    <!-- 注文一覧表示 (表形式) -->
    <table class="table-auto mt-4 w-full">
      <thead>
        <tr>
          <th class="border px-4 py-2">注文ID</th>
          <th class="border px-4 py-2">商品ID</th>
          <th class="border px-4 py-2">数量</th>
          <th class="border px-4 py-2">合計金額</th>
          <th class="border px-4 py-2">日時</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td class="border px-4 py-2">{{ order.id }}</td>
          <td class="border px-4 py-2">{{ order.productId }}</td>
          <td class="border px-4 py-2">{{ order.quantity }}</td>
          <td class="border px-4 py-2">¥{{ order.totalPrice.toLocaleString() }}</td>
          <td class="border px-4 py-2">{{ formatDate(order.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOrder } from "~/composables/useOrder";
import type { Order } from "~/composables/useOrder";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// プラグインを拡張
dayjs.extend(utc);
dayjs.extend(timezone);

const { getOrders, createOrder } = useOrder();

const orders = ref<Order[]>([]);
const newOrder = ref<{ productId?: number; quantity?: number; userId?: number }>({
  productId: undefined,
  quantity: undefined,
  userId: undefined,
});

const fetchOrders = async () => {
  orders.value = await getOrders();
};

const addOrder = async () => {
  if (
    newOrder.value.productId === undefined ||
    newOrder.value.quantity === undefined ||
    newOrder.value.userId === undefined
  ) {
    console.error("すべてのフィールドを入力してください。");
    return;
  }

  await createOrder({
    productId: newOrder.value.productId,
    quantity: newOrder.value.quantity,
    userId: newOrder.value.userId,
  });

  // フォームをリセット
  newOrder.value = {
    productId: undefined,
    quantity: undefined,
    userId: undefined,
  };
  await fetchOrders();
};

// 日付フォーマット関数
const formatDate = (dateString: string): string => {
  return dayjs(dateString).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm");
};

onMounted(fetchOrders);
</script>
