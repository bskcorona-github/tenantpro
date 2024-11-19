export interface Order {
    id: number;
    productId: number;
    quantity: number;
    userId:number;
    totalPrice: number;
    createdAt: string;
  }
  
  export const useOrder = () => {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
  
    const getOrders = async (): Promise<Order[]> => {
      try {
        const data: Order[] = await $fetch(`${apiBaseUrl}/orders/read`);
        return data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
    };
  
    const createOrder = async (payload: { productId: number; quantity: number ;userId:number}): Promise<Order | null> => {
      try {
        const data: Order = await $fetch(`${apiBaseUrl}/orders/create`, {
          method: "POST",
          body: payload,
        });
        return data;
      } catch (error) {
        console.error("Error creating order:", error);
        return null;
      }
    };
  
    return { getOrders, createOrder };
  };
  