import { API_BASE_URL } from "@/config";

export type MetalPriceData = {
  timestamp: number;
  metal: string;
  currency: string;
  exchange?: string;
  symbol?: string;
  prev_close_price?: number;
  open_price?: number;
  low_price?: number;
  high_price?: number;
  open_time?: number;
  price?: number;
  ch?: number;
  chp?: number;
  ask?: number;
  bid?: number;
  price_gram_24k?: number;
  price_gram_22k?: number;
  price_gram_21k?: number;
  price_gram_20k?: number;
  price_gram_18k?: number;
  price_gram_16k?: number;
  price_gram_14k?: number;
  price_gram_10k?: number;
};

export type MetalItem = {
  metal: string;
  symbol?: string;
  price_data: MetalPriceData;
};

export type MetalSummary = {
  metal: string;
  unit: string;
  [key: string]: number | string;
};

export type MetalsSummary = {
  Gold?: MetalSummary;
  Silver?: MetalSummary & { price?: number };
  [key: string]: MetalSummary | undefined;
};

export type GoldPriceResponse = {
  status?: boolean;
  message?: string;
  data?: MetalItem[];
  summary?: MetalsSummary;
};

export type GoldPriceResult = {
  items: MetalItem[];
  summary: MetalsSummary;
};

export async function adminGetGoldPrice(
  token: string
): Promise<GoldPriceResult> {
  const res = await fetch(`${API_BASE_URL}/admin/gold-price`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch metal rates";
    try {
      const json = (await res.json()) as GoldPriceResponse;
      message = json?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = (await res.json()) as GoldPriceResponse;
  return {
    items: json?.data || [],
    summary: json?.summary || ({} as MetalsSummary),
  };
}

// Manual Rates API types
export type ManualRateItem = {
  id: number;
  metal: string;
  karat: string;
  rate_per_gm: string | number;
  rate_date: string; // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
};

export type ManualRatesByMetal = Record<string, ManualRateItem[]>;

export type GetManualRatesTodayResponse = {
  success?: boolean;
  data?: ManualRatesByMetal;
  message?: string;
};

export type GetManualRatesResponse = {
  success?: boolean;
  data?: Record<string, ManualRatesByMetal>; // date -> { metal -> items[] }
  message?: string;
};

export async function getManualRatesToday(token: string): Promise<ManualRatesByMetal> {
  const res = await fetch(`${API_BASE_URL}/admin/manual-rates/today`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch today's manual rates";
    try {
      const json = (await res.json()) as GetManualRatesTodayResponse;
      message = json?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = (await res.json()) as GetManualRatesTodayResponse;
  return json?.data || {};
}

export async function getManualRates(token: string): Promise<Record<string, ManualRatesByMetal>> {
  const res = await fetch(`${API_BASE_URL}/admin/manual-rates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let message = "Failed to fetch manual rates history";
    try {
      const json = (await res.json()) as GetManualRatesResponse;
      message = json?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = (await res.json()) as GetManualRatesResponse;
  return json?.data || {};
}

// Save manual rates API types
export type SaveManualRatesRequest = {
  gold?: Record<string, number>;
  silver?: Record<string, number>;
  platinum?: Record<string, number>;
};

export type SaveManualRatesResponse = {
  success?: boolean;
  message?: string;
  data?: any;
};

export async function saveManualRates(
  token: string,
  rates: SaveManualRatesRequest
): Promise<SaveManualRatesResponse> {
  const res = await fetch(`${API_BASE_URL}/admin/manual-rates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(rates),
  });

  if (!res.ok) {
    let message = "Failed to save manual rates";
    try {
      const json = (await res.json()) as SaveManualRatesResponse;
      message = json?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = (await res.json()) as SaveManualRatesResponse;
  return json;
}

// Apply saved manual rates to products
export type ApplyManualRatesResponse = {
  success?: boolean;
  message?: string;
  data?: any;
};

export async function applyManualRatesToProducts(
  token: string
): Promise<ApplyManualRatesResponse> {
  const res = await fetch(
    `${API_BASE_URL}/admin/products/apply-manual-rates`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    let message = "Failed to apply manual rates to products";
    try {
      const json = (await res.json()) as ApplyManualRatesResponse;
      message = json?.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const json = (await res.json()) as ApplyManualRatesResponse;
  return json;
}
