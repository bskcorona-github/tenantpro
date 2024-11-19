import { useRuntimeConfig } from "#app";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // 例: "admin" or "user"
  createdAt: string;
}

export const useUser = () => {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;

  const getUsers = async (): Promise<User[]> => {
    try {
      const data: User[] = await $fetch(`${apiBaseUrl}/users/read`); // エンドポイントを確認
      return data;
    } catch (error: unknown) {
      console.error("Error fetching users:", error instanceof Error ? error.message : error);
      return [];
    }
  };

  const createUser = async (payload: { name: string; email: string; role: string }): Promise<User | null> => {
    try {
      const data: User = await $fetch(`${apiBaseUrl}/users/create`, {
        method: "POST",
        body: payload,
      });
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  };

  const updateUser = async (id: number, payload: { name?: string; email?: string; role?: string }): Promise<User | null> => {
    try {
      const data: User = await $fetch(`${apiBaseUrl}/users/update/${id}`, {
        method: "PUT",
        body: payload,
      });
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      await $fetch(`${apiBaseUrl}/users/delete/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return { getUsers, createUser, updateUser, deleteUser };
};
