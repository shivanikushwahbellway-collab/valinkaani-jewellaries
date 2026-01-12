import axios from "axios";
import { API_BASE_URL } from "@/config";

// Normalized scheme type for UI consumption
export type Scheme = {
    id: number;
    name: string; // maps from `scheme`
    timeline: string;
    minAmount: number; // maps from `min_amount`
    maturityAmount?: number; // maps from `maturity_amount`
    isPopular: number; // 0/1
    status: number; // 0/1
    points: string[];
    attachments?: string[]; // URLs/paths returned by API
};

// Internal: normalize a single API item into Scheme
function normalizeScheme(apiItem: any): Scheme {
    const rawPoints = apiItem?.points;
    let pointsArray: string[] = [];
    if (Array.isArray(rawPoints)) {
        pointsArray = rawPoints.filter((p: any) => typeof p === "string");
    } else if (typeof rawPoints === "string") {
        try {
            const parsed = JSON.parse(rawPoints);
            if (Array.isArray(parsed)) pointsArray = parsed.filter((p: any) => typeof p === "string");
        } catch {
            // if parsing fails, fallback to single string entry
            pointsArray = [rawPoints];
        }
    }

    return {
        id: Number(apiItem?.id),
        name: String(apiItem?.scheme ?? apiItem?.name ?? ""),
        timeline: String(apiItem?.timeline ?? ""),
        minAmount: Number(apiItem?.min_amount ?? apiItem?.minAmount ?? 0),
        maturityAmount: apiItem?.maturity_amount || apiItem?.maturityAmount ? Number(apiItem?.maturity_amount ?? apiItem?.maturityAmount) : undefined,
        status: Number(apiItem?.status ?? 0),
        isPopular: Number(apiItem?.is_popular ?? apiItem?.isPopular ?? 0),
        points: pointsArray,
        attachments: Array.isArray(apiItem?.attachments) ? apiItem.attachments : [],
    };
}

// Get all schemes (admin)
export async function getAllSchemes(token: string): Promise<{ success: boolean; message: string; data: Scheme[] }>
{
    try {
        const res = await axios.get(`${API_BASE_URL}/admin/scheme`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const success = Boolean(res.data?.sucess ?? res.data?.success);
        const message = String(res.data?.massage ?? res.data?.message ?? "");
        const list = Array.isArray(res.data?.data) ? res.data.data.map(normalizeScheme) : [];
        return { success, message, data: list };
    } catch (error) {
        // bubble up for caller to toast
        throw error;
    }
}

export type UpdateSchemePayload = {
    name: string; // maps to `scheme`
    timeline: string;
    minAmount: number; // maps to `min_amount`
    maturityAmount?: number; // maps to `maturity_amount`
    status: number; // 0 or 1
    isPopular: number; // 0 or 1
    points: string[];
    attachments?: File[]; // optional uploads
};

// Update a scheme (multipart form as per backend)
export async function updateScheme(
    token: string,
    id: number,
    payload: UpdateSchemePayload
): Promise<{ message: string }>
{
    const form = new FormData();
    form.append("scheme", payload.name);
    form.append("timeline", payload.timeline);
    form.append("min_amount", String(payload.minAmount));
    if (payload.maturityAmount !== undefined) {
        form.append("maturity_amount", String(payload.maturityAmount));
    }
    form.append("status", String(payload.status));
    form.append("is_popular", String(payload.isPopular));
    payload.points.forEach((p, idx) => {
        form.append(`points[${idx}]`, p);
    });
    if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach((file) => form.append("attachments[]", file));
    }


    const res = await axios.post(`${API_BASE_URL}/admin/scheme/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return { message: String(res.data?.message ?? "") };
}

