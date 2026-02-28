const API_KEY = import.meta.env.VITE_API_SECRET ?? "";
console.log("API KEY:", API_KEY);

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
            ...options.headers,
        },
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json() as Promise<T>;
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface Stats {
    members: number;
    viewers: number;
    subs: number;
    warns: number;
    bans: number;
}

export interface Member {
    id: string;
    name: string;
    role: "sub" | "viewer" | string;
}

export interface Revenue {
    id: string;
    date: string;
    source: "bits" | "sub" | "gift_sub" | "raid" | "donation" | "other";
    amount: number;
    description?: string;
}

// ── Discord ──────────────────────────────────────────────────────────────────

export const getStats   = () => apiFetch<Stats>("/api/stats");
export const getMembers = () => apiFetch<Member[]>("/api/members");

// ── Finance ──────────────────────────────────────────────────────────────────

export const getRevenues    = () => apiFetch<Revenue[]>("/api/finance/revenues");
export const addRevenue     = (data: Omit<Revenue, "id">) =>
    apiFetch<Revenue>("/api/finance/revenues", { method: "POST", body: JSON.stringify(data) });
export const deleteRevenue  = (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/finance/revenues/${id}`, { method: "DELETE" });