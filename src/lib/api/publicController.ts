import { API_BASE_URL } from "@/config";
import axios from "axios";


// Public Collections API
export const getPublicCollections = async () => {
  const response = await axios.get(`${API_BASE_URL}/collections`);
  return response;
};

export const getCollectionProducts = async (collectionId: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/collections/${collectionId}/products`);
  return response;
};

// Public Categories API
export const getPublicCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/categories`);
  return response;
};

export const getCategoryProducts = async (categoryId: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}/products`);
  return response;
};

// Public Banners API
export const getPublicBanners = async () => {
  const response = await axios.get(`${API_BASE_URL}/banners`);
  return response;
};
