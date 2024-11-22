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
      <input
    v-model="newUser.password"
    type="password"
    placeholder="パスワード"
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
          <td class="border px-4 py-2">
  {{ user.role === 'admin' ? '管理者' : 'ユーザー' }}
</td>
          <td class="border px-4 py-2">
            <button @click="openEditModal(user)" class="btn-edit">編集</button>
            <button @click="removeUser(user.id)" class="btn-delete">削除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 編集用モーダル -->
    <div v-if="isModalOpen && editingUser" class="modal-overlay">
      <div class="modal">
        <h2 class="text-xl font-bold mb-4">ユーザー編集</h2>
        <form @submit.prevent="saveUser">
          <input
            v-model="editingUser.name"
            placeholder="名前"
            class="input mb-2"
          />
          <input
            v-model="editingUser.email"
            type="email"
            placeholder="メールアドレス"
            class="input mb-2"
          />
          <select v-model="editingUser.role" class="input mb-2">
            <option value="user">ユーザー</option>
            <option value="admin">管理者</option>
          </select>
          <button type="submit" class="btn">保存</button>
          <button type="button" @click="closeModal" class="btn-cancel">
            キャンセル
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUser } from "~/composables/useUsers";
import type { User } from "~/composables/useUsers";

const { getUsers, createUser, updateUser, deleteUser } = useUser();

const users = ref<User[]>([]);
const newUser = ref<{ name: string; email: string;password:string;  role: string }>({
  name: "",
  email: "",
  password:"",
  role: "user",
});

const isModalOpen = ref(false);
const editingUser = ref<User | null>(null);

const fetchUsers = async () => {
  users.value = await getUsers();
};

const addUser = async () => {
  if (!newUser.value.name || !newUser.value.email||!newUser.value.password) return;
  await createUser(newUser.value);
  await fetchUsers();
  newUser.value = { name: "", email: "", role: "user",password:"" };
};

const openEditModal = (user: User) => {
  console.log("編集対象のユーザー:", user);
  editingUser.value = { ...user };
  isModalOpen.value = true;
};

const closeModal = () => {
  editingUser.value = null;
  isModalOpen.value = false;
};

const saveUser = async () => {
  if (!editingUser.value) {
    console.error("編集対象のユーザーが選択されていません");
    return;
  }

  try {
    await updateUser(editingUser.value.id, {
      name: editingUser.value.name || "",
      email: editingUser.value.email || "",
      role: editingUser.value.role || "user",
    });
    await fetchUsers();
    closeModal();
  } catch (error) {
    console.error("ユーザーの更新に失敗しました:", error);
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


