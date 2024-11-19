<template>
  <div class="container mx-auto py-10">
    <h1 class="text-2xl font-bold mb-4">ユーザー管理</h1>

    <!-- ユーザー作成フォーム -->
    <form @submit.prevent="addUser">
      <input v-model="newUser.name" placeholder="名前" class="input mb-2" />
      <input
        v-model="newUser.email"
        type="email"
        placeholder="メールアドレス"
        class="input mb-2"
      />
      <select v-model="newUser.role" class="input mb-2">
        <option value="user">ユーザー</option>
        <option value="admin">管理者</option>
      </select>
      <button type="submit" class="btn">ユーザーを追加</button>
    </form>

    <!-- ユーザー一覧表示 -->
    <table class="table-auto mt-4 w-full">
      <thead>
        <tr>
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">名前</th>
          <th class="border px-4 py-2">メールアドレス</th>
          <th class="border px-4 py-2">役割</th>
          <th class="border px-4 py-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="border px-4 py-2">{{ user.id }}</td>
          <td class="border px-4 py-2">{{ user.name }}</td>
          <td class="border px-4 py-2">{{ user.email }}</td>
          <td class="border px-4 py-2">{{ user.role }}</td>
          <td class="border px-4 py-2">
            <button @click="editUser(user)" class="btn-edit">編集</button>
            <button @click="removeUser(user.id)" class="btn-delete">
              削除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUser } from "~/composables/useUsers";
import type { User } from "~/composables/useUsers";

const { getUsers, createUser, updateUser, deleteUser } = useUser();

const users = ref<User[]>([]);
const newUser = ref<{ name: string; email: string; role: string }>({
  name: "",
  email: "",
  role: "user",
});

const fetchUsers = async () => {
  users.value = await getUsers();
};

const addUser = async () => {
  if (!newUser.value.name || !newUser.value.email) return;
  await createUser(newUser.value);
  await fetchUsers();
  newUser.value = { name: "", email: "", role: "user" };
};

const editUser = (user: User) => {
  const updatedName = prompt("名前を編集:", user.name);
  const updatedEmail = prompt("メールアドレスを編集:", user.email);
  const updatedRole = prompt("役割を編集 (user/admin):", user.role);
  if (updatedName && updatedEmail && updatedRole) {
    updateUser(user.id, {
      name: updatedName,
      email: updatedEmail,
      role: updatedRole,
    });
    fetchUsers();
  }
};

const removeUser = async (id: number) => {
  if (confirm("本当に削除しますか？")) {
    await deleteUser(id);
    await fetchUsers();
  }
};

onMounted(fetchUsers);
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
  background-color: #ffc107;
  margin-right: 5px;
}
.btn-delete {
  background-color: #dc3545;
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
