<template>
    <div class="container mx-auto py-10">
      <h1 class="text-2xl font-bold mb-4">テナント管理</h1>
  
      <!-- テナント作成フォーム -->
      <form @submit.prevent="addTenant">
        <input v-model="name" placeholder="テナント名" class="input mb-2" />
        <input v-model.number="ownerId" type="number" placeholder="オーナーID" class="input mb-2" />
        <button type="submit" class="btn">テナント作成</button>
      </form>
  
      <!-- テナント一覧 -->
      <ul class="list mt-4">
        <li v-for="tenant in tenants" :key="tenant.id">
          <div>
            {{ tenant.name }} (Owner ID: {{ tenant.ownerId }})
            <button @click="editTenant(tenant)" class="btn btn-secondary">編集</button>
            <button @click="removeTenant(tenant.id)" class="btn btn-danger">削除</button>
          </div>
        </li>
      </ul>
  
      <!-- 編集フォーム -->
      <div v-if="editingTenant" class="modal">
        <h2 class="text-xl font-bold">テナント編集</h2>
        <form @submit.prevent="updateTenantDetails">
          <input v-model="editName" placeholder="テナント名" class="input mb-2" />
          <button type="submit" class="btn">更新</button>
          <button @click="cancelEdit" class="btn btn-secondary">キャンセル</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useTenant } from "~/composables/useTenant";
  import type { Tenant } from "~/composables/useTenant";
  
  const { getTenants, createTenant, updateTenant, deleteTenant } = useTenant();
  const tenants = ref<Tenant[]>([]);
  
  const name = ref<string>("");
  const ownerId = ref<number | undefined>(undefined);
  
  // 編集用
  const editingTenant = ref<Tenant | null>(null);
  const editName = ref<string>("");
  
  const fetchTenants = async () => {
    tenants.value = await getTenants();
  };
  
  const addTenant = async () => {
    if (!name.value || ownerId.value === undefined) return;
    await createTenant({ name: name.value, ownerId: ownerId.value });
    await fetchTenants();
    name.value = "";
    ownerId.value = undefined;
  };
  
  const editTenant = (tenant: Tenant) => {
    editingTenant.value = tenant;
    editName.value = tenant.name;
  };
  
  const updateTenantDetails = async () => {
    if (editingTenant.value) {
      await updateTenant(editingTenant.value.id, {
        name: editName.value,
      });
      await fetchTenants();
      cancelEdit();
    }
  };
  
  const cancelEdit = () => {
    editingTenant.value = null;
    editName.value = "";
  };
  
  const removeTenant = async (id: number) => {
    const confirmed = confirm("このテナントを削除してもよろしいですか？");
    if (confirmed) {
      await deleteTenant(id);
      await fetchTenants();
    }
  };
  
  onMounted(fetchTenants);
  </script>
  
   <style>
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
  .input {
    display: block;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .btn {
    padding: 0.5rem 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 0.5em;
  }
  .btn-secondary {
    background-color: #6c757d;
  }
  .btn-danger {
    background-color: #dc3545;
  }
  </style> -->
  