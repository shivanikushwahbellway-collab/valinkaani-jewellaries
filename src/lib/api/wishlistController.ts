import axios from "axios";
import { API_BASE_URL } from "@/config";

interface AddToWishlistData {
  product_id: number;
}

interface RemoveFromWishlistData {
  wishlist_id: number;
}

export const addToWishlist = async (data: AddToWishlistData, token: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/wishlist/add`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWishlistItems = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromWishlist = async (
  data: { wishlist_id?: number; product_id?: number; id?: number },
  token: string
) => {
  try {
    // Try POST first with flexible data structure
    const response = await axios.post(
      `${API_BASE_URL}/wishlist/remove`,
      {
        wishlist_id: data.wishlist_id || data.id,
        product_id: data.product_id,
        id: data.id || data.wishlist_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // If POST fails, try DELETE method
    if (error.response?.status === 404 || error.response?.status === 405) {
      try {
        const wishlistId = data.wishlist_id || data.id;
        const response = await axios.delete(
          `${API_BASE_URL}/wishlist/${wishlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (deleteError) {
        throw deleteError;
      }
    }
    throw error;
  }
};
