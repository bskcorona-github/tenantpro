export interface Tenant {
    id: number;
    name: string;
    ownerName: string;
  }
  
  export const useTenant = () => {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
  
    const getTenants = async (): Promise<Tenant[]> => {
      try {
        const data: Tenant[] = await $fetch(`${apiBaseUrl}/tenants/read`);
        return data;
      } catch (error) {
        console.error("Error fetching tenants:", error);
        return [];
      }
    };
  
    const createTenant = async (payload: { name: string; ownerName: string }): Promise<Tenant | null> => {
      try {
        const data: Tenant = await $fetch(`${apiBaseUrl}/tenants/create`, {
          method: "POST",
          body: payload,
        });
        return data;
      } catch (error) {
        console.error("Error creating tenant:", error);
        return null;
      }
    };
  
    const updateTenant = async (id: number, payload: { name?: string; ownerName?: string }): Promise<Tenant | null> => {
      try {
        const data: Tenant = await $fetch(`${apiBaseUrl}/tenants/update`, {
          method: "PUT",
          body: { id, ...payload },
        });
        return data;
      } catch (error) {
        console.error("Error updating tenant:", error);
        return null;
      }
    };
  
    const deleteTenant = async (id: number): Promise<boolean> => {
      try {
        await $fetch(`${apiBaseUrl}/tenants/delete`, {
          method: "DELETE",
          body: { id },
        });
        return true;
      } catch (error) {
        console.error("Error deleting tenant:", error);
        return false;
      }
    };
  
    return { getTenants, createTenant, updateTenant, deleteTenant };
  };
  