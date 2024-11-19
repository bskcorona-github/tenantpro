export interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    tenantId: number;
  }
  
  export const useProduct = () => {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
  
    const getProducts = async (): Promise<Product[]> => {
      try {
        const data: Product[] = await $fetch(`${apiBaseUrl}/products/read`);
        return data;
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    };
  
    const createProduct = async (payload: Omit<Product, "id">): Promise<Product | null> => {
      try {
        const data: Product = await $fetch(`${apiBaseUrl}/products/create`, {
          method: "POST",
          body: payload,
        });
        return data;
      } catch (error) {
        console.error("Error creating product:", error);
        return null;
      }
    };
  
    const updateProductApi = async (id: number, payload: Partial<Omit<Product, "id">>): Promise<Product | null> => {
        try {
          const data: Product = await $fetch(`${apiBaseUrl}/products/update`, {
            method: "PUT",
            body: { id, ...payload },
          });
          return data;
        } catch (error) {
          console.error("Error updating product:", error);
          return null;
        }
      };
  
    const deleteProduct = async (id: number): Promise<boolean> => {
      try {
        await $fetch(`${apiBaseUrl}/products/delete`, {
          method: "DELETE",
          body: { id },
        });
        return true;
      } catch (error) {
        console.error("Error deleting product:", error);
        return false;
      }
    };
  
    return { getProducts, createProduct, updateProductApi, deleteProduct };
  };
  