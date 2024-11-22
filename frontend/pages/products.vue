<template>
  <div class="container mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">商品管理</h1>

    <!-- 商品作成フォーム -->
    <form @submit.prevent="addProduct">
      <input v-model="newProduct.name" placeholder="商品名" class="input mb-2" />
      <input v-model.number="newProduct.price" type="number" placeholder="価格" class="input mb-2" />
      <input v-model="newProduct.category" placeholder="カテゴリ" class="input mb-2" />
      <input v-model.number="newProduct.stock" type="number" placeholder="在庫" class="input mb-2" />
      <input v-model.number="newProduct.tenantName" type="number" placeholder="テナントID" class="input mb-2" />
      <button type="submit" class="btn">商品を追加</button>
    </form>

    <!-- 商品一覧表示 (表形式) -->
    <table class="table-auto mt-4 w-full">
      <thead>
        <tr>
          <th class="border px-4 py-2">商品ID</th>
          <th class="border px-4 py-2">商品名</th>
          <th class="border px-4 py-2">価格</th>
          <th class="border px-4 py-2">カテゴリ</th>
          <th class="border px-4 py-2">在庫</th>
          <th class="border px-4 py-2">テナント名</th> <!-- 修正 -->
          <th class="border px-4 py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="border px-4 py-2">{{ product.id }}</td>
          <td class="border px-4 py-2">{{ product.name }}</td>
          <td class="border px-4 py-2">¥{{ product.price.toLocaleString() }}</td>
          <td class="border px-4 py-2">{{ product.category }}</td>
          <td class="border px-4 py-2">{{ product.stock }}</td>
          <td class="border px-4 py-2">{{ product.tenantName }}</td> <!-- 修正 -->
          <td class="border px-4 py-2">
            <button @click="editProduct(product)" class="btn-edit">編集</button>
            <button @click="removeProduct(product.id)" class="btn-delete">削除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 編集モーダル -->
    <div v-if="editingProduct" class="modal">
      <h2 class="text-xl font-bold mb-4">商品編集</h2>
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
  tenantName: "",
});
const editingProduct = ref<Product | null>(null);

const fetchProducts = async () => {
  products.value = await getProducts();
};

const addProduct = async () => {
  if (!newProduct.value.name || newProduct.value.price <= 0) return;
  await createProduct(newProduct.value);
  await fetchProducts();
  newProduct.value = { name: "", price: 0, category: "", stock: 0, tenantName: ""};
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
