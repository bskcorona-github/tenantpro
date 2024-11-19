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
  
      <!-- 注文一覧表示 -->
      <ul class="list mt-4">
        <li v-for="order in orders" :key="order.id">
          注文ID: {{ order.id }} / 商品ID: {{ order.productId }} / 数量: {{ order.quantity }} / 合計金額: ¥{{ order.totalPrice }} / 日時: {{ formatDate(order.createdAt) }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useOrder } from "~/composables/useOrder";
  import type { Order } from "~/composables/useOrder";
  import dayjs from "dayjs";
  import utc from "dayjs/plugin/utc";
  import timezone from"dayjs/plugin/timezone";
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
  .list {
    list-style: none;
    padding: 0;
  }
  .list li {
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
  }
  </style>
  