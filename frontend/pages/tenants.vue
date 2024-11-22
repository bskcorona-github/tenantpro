<template>
  <div class="container mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">テナント管理</h1>

    <!-- テナント作成フォーム -->
    <form @submit.prevent="addTenant">
      <input v-model="name" placeholder="テナント名" class="input mb-2" />
      <input v-model.number="ownerName" type="string" placeholder="オーナー名" class="input mb-2" />
      <button type="submit" class="btn">テナント作成</button>
    </form>

    <!-- テナント一覧 (表形式) -->
    <table class="table-auto mt-4 w-full">
      <thead>
        <tr>
          <th class="border px-4 py-2">テナントID</th>
          <th class="border px-4 py-2">テナント名</th>
          <th class="border px-4 py-2">オーナー名 </th>
          <th class="border px-4 py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tenant in tenants" :key="tenant.id">
          <td class="border px-4 py-2">{{ tenant.id }}</td>
          <td class="border px-4 py-2">{{ tenant.name }}</td>
          <td class="border px-4 py-2">{{ tenant.ownerName }}</td>
          <td class="border px-4 py-2">
            <button @click="editTenant(tenant)" class="btn-edit">編集</button>
            <button @click="removeTenant(tenant.id)" class="btn-delete">削除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 編集フォーム -->
    <div v-if="editingTenant" class="modal">
      <h2 class="text-xl font-bold">テナント編集</h2>
      <form @submit.prevent="updateTenantDetails">
        <input v-model="editName" placeholder="テナント名" class="input mb-2" />
        <button type="submit" class="btn">更新</button>
        <button @click="cancelEdit" class="btn btn-cancel">キャンセル</button>
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
const ownerName = ref<string | undefined>(undefined);

// 編集用
const editingTenant = ref<Tenant | null>(null);
const editName = ref<string>("");

const fetchTenants = async () => {
  tenants.value = await getTenants();
};

const addTenant = async () => {
  if (!name.value || ownerName.value === undefined) return;
  await createTenant({ name: name.value, ownerName: ownerName.value });
  await fetchTenants();
  name.value = "";
  ownerName.value = undefined;
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
