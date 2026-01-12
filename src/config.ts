// During development, we go through the Vite proxy to avoid CORS
export const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : "https://vailankannijewellers.com/vailankanni-backend/api";

// Backend storage URL for images
export const STORAGE_BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://vailankannijewellers.com/vailankanni-backend/storage/app/public"
    : "https://vailankannijewellers.com/vailankanni-backend/storage/app/public";

// Helper function to get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${STORAGE_BASE_URL}/${imagePath}`;
};
