<template>
    <div class="container mx-auto py-10">
      <h1 class="text-2xl font-bold mb-4">商品管理</h1>
  
      <!-- 商品作成フォーム -->
      <form @submit.prevent="addProduct">
        <input v-model="newProduct.name" placeholder="商品名" class="input mb-2" />
        <input v-model.number="newProduct.price" type="number" placeholder="価格" class="input mb-2" />
        <input v-model="newProduct.category" placeholder="カテゴリ" class="input mb-2" />
        <input v-model.number="newProduct.stock" type="number" placeholder="在庫" class="input mb-2" />
        <input v-model.number="newProduct.tenantId" type="number" placeholder="テナントID" class="input mb-2" />
        <button type="submit" class="btn">商品を追加</button>
      </form>
  
      <!-- 商品一覧表示 -->
      <ul class="list mt-4">
        <li v-for="product in products" :key="product.id">
          {{ product.name }} - ¥{{ product.price }} (在庫: {{ product.stock }})
          <button @click="editProduct(product)" class="btn-edit">編集</button>
          <button @click="removeProduct(product.id)" class="btn-delete">削除</button>
        </li>
      </ul>
  
      <!-- 編集モーダル -->
      <div v-if="editingProduct" class="modal">
        <h2>商品編集</h2>
        <input v-model="editingProduct.name" placeholder="商品名" class="input mb-2" />
        <input v-model.number="editingProduct.price" type="number" placeholder="価格" class="input mb-2" />
        <input v-model="editingProduct.category" placeholder="カテゴリ" class="input mb-2" />
        <input v-model.number="editingProduct.stock" type="number" placeholder="在庫" class="input mb-2" />
        <button @click="saveProductEdit(editingProduct.id)" class="btn">保存</button>
        <button @click="cancelEdit" class="btn-cancel">キャンセル</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useProduct } from "~/composables/useProduct";
  import type { Product } from "~/composables/useProduct";
  
  const { getProducts, createProduct, updateProductApi, deleteProduct } = useProduct();
  
  const products = ref<Product[]>([]);
  const newProduct = ref<Omit<Product, "id">>({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    tenantId: 0,
  });
  const editingProduct = ref<Product | null>(null);
  
  const fetchProducts = async () => {
    products.value = await getProducts();
  };
  
  const addProduct = async () => {
    if (!newProduct.value.name || newProduct.value.price <= 0) return;
    await createProduct(newProduct.value);
    await fetchProducts();
    newProduct.value = { name: "", price: 0, category: "", stock: 0, tenantId: 0 };
  };
  
  const editProduct = (product: Product) => {
    editingProduct.value = { ...product };
  };
  
  const saveProductEdit = async (id: number) => {
    if (!editingProduct.value) return;
    await updateProductApi(id, editingProduct.value);
    editingProduct.value = null;
    await fetchProducts();
  };
  
  const removeProduct = async (id: number) => {
    await deleteProduct(id);
    await fetchProducts();
  };
  
  const cancelEdit = () => {
    editingProduct.value = null;
  };
  
  onMounted(fetchProducts);
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
  .btn-edit {
    margin-left: 10px;
    background-color: #28a745;
  }
  .btn-delete {
    margin-left: 10px;
    background-color: #dc3545;
  }
  .modal {
    background: #fff;
    border: 1px solid #ccc;
    padding: 1rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
  </style>
  