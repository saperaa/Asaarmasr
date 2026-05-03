import { useCallback, useEffect, useState } from "react";

export interface GoldApiResponse {
  success: boolean;
  timestamp: string;
  currency: string;
  is_live: boolean;
  gold_price_usd: number;
  usd_to_egp: number;
  sagha_dollar_rate: number;
  prices: {
    gram_24k: { buy: number; sell: number };
    gram_22k: { buy: number; sell: number };
    gram_21k: { buy: number; sell: number };
    gram_18k: { buy: number; sell: number };
    gram_14k: { buy: number; sell: number };
    gold_pound: number;
    ounce_egp: number;
  };
  source: string;
}

export interface PriceChanges {
  gram_24k: { change: number; changePercent: number };
  gram_22k: { change: number; changePercent: number };
  gram_21k: { change: number; changePercent: number };
  gram_18k: { change: number; changePercent: number };
  gram_14k: { change: number; changePercent: number };
  gold_pound: { change: number; changePercent: number };
  ounce_egp: { change: number; changePercent: number };
}

interface PriceBaseline {
  date: string; // YYYY-MM-DD — resets each day
  gram_24k: number;
  gram_22k: number;
  gram_21k: number;
  gram_18k: number;
  gram_14k: number;
  gold_pound: number;
  ounce_egp: number;
}

const API_URL = "https://asaarmasr.info/api/v1/gold";
const REFRESH_MS = 12_000;
const BASELINE_KEY = "asaarMasr_goldBaseline";

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadBaseline(): PriceBaseline | null {
  try {
    const raw = localStorage.getItem(BASELINE_KEY);
    if (!raw) return null;
    const b: PriceBaseline = JSON.parse(raw);
    // Discard if it's from a previous day
    return b.date === todayDate() ? b : null;
  } catch {
    return null;
  }
}

function saveBaseline(data: GoldApiResponse): PriceBaseline {
  const b: PriceBaseline = {
    date: todayDate(),
    gram_24k: data.prices.gram_24k.buy,
    gram_22k: data.prices.gram_22k.buy,
    gram_21k: data.prices.gram_21k.buy,
    gram_18k: data.prices.gram_18k.buy,
    gram_14k: data.prices.gram_14k.buy,
    gold_pound: data.prices.gold_pound,
    ounce_egp: data.prices.ounce_egp,
  };
  try {
    localStorage.setItem(BASELINE_KEY, JSON.stringify(b));
  } catch { /* private/incognito mode */ }
  return b;
}

function calcChange(current: number, base: number) {
  const change = current - base;
  const changePercent = base !== 0 ? (change / base) * 100 : 0;
  return { change, changePercent };
}

function computeChanges(data: GoldApiResponse, baseline: PriceBaseline): PriceChanges {
  return {
    gram_24k: calcChange(data.prices.gram_24k.buy, baseline.gram_24k),
    gram_22k: calcChange(data.prices.gram_22k.buy, baseline.gram_22k),
    gram_21k: calcChange(data.prices.gram_21k.buy, baseline.gram_21k),
    gram_18k: calcChange(data.prices.gram_18k.buy, baseline.gram_18k),
    gram_14k: calcChange(data.prices.gram_14k.buy, baseline.gram_14k),
    gold_pound: calcChange(data.prices.gold_pound, baseline.gold_pound),
    ounce_egp: calcChange(data.prices.ounce_egp, baseline.ounce_egp),
  };
}

export function useGoldApi() {
  const [data, setData] = useState<GoldApiResponse | null>(null);
  const [changes, setChanges] = useState<PriceChanges | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: GoldApiResponse = await res.json();
      if (!json.success) throw new Error("API returned success: false");

      // Load today's baseline or create it from this first fetch of the day
      const baseline = loadBaseline() ?? saveBaseline(json);
      setChanges(computeChanges(json, baseline));
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch gold prices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  return { data, changes, loading, error, lastUpdated, refetch: fetchData };
}
