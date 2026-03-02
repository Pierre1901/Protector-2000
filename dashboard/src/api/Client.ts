// Toutes les requêtes partent avec credentials: "include"
// pour que le cookie de session soit automatiquement envoyé.
// Plus aucun secret dans le code frontend.

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(path, {
        ...options,
        credentials: "include", // envoie le cookie httpOnly
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (res.status === 401) throw new Error("UNAUTHORIZED");
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json() as Promise<T>;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Stats {
    members: number;
    viewers: number;
    subs:    number;
    warns:   number;
    bans:    number;
}

export interface Member {
    id:   string;
    name: string;
    role: "sub" | "viewer" | string;
}

export interface Revenue {
    id:           string;
    date:         string;
    source:       "bits" | "sub" | "gift_sub" | "raid" | "donation" | "other";
    amount:       number;
    description?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const login  = (password: string) =>
    apiFetch<{ ok: boolean }>("/api/login",  { method: "POST", body: JSON.stringify({ password }) });

export const logout = () =>
    apiFetch<{ ok: boolean }>("/api/logout", { method: "POST" });

// ── Discord ───────────────────────────────────────────────────────────────────

export const getStats   = () => apiFetch<Stats>("/api/stats");
export const getMembers = () => apiFetch<Member[]>("/api/members");

// ── Finance ───────────────────────────────────────────────────────────────────

export const getRevenues   = () => apiFetch<Revenue[]>("/api/finance/revenues");
export const addRevenue    = (data: Omit<Revenue, "id">) =>
    apiFetch<Revenue>("/api/finance/revenues", { method: "POST", body: JSON.stringify(data) });
export const deleteRevenue = (id: string) =>
    apiFetch<{ ok: boolean }>(`/api/finance/revenues/${id}`, { method: "DELETE" });