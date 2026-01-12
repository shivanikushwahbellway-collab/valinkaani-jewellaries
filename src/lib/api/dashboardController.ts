import axios from "axios";
import { API_BASE_URL } from "@/config";

export const getAnalytics = async (token:string)=>{
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/reports/analytics`,
        {
            headers:{Authorization:`Bearer ${token}`}
        }
    )
    return response
  } catch (error) {
    console.log("Erro fetching anlytics : ", error)
    throw error
  }
}