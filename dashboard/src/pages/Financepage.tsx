import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import { getRevenues, addRevenue, deleteRevenue, type Revenue } from "../api/Client";
import { Panel } from "../components/Ui";

// ── Couleurs par source ───────────────────────────────────────────────────────
const SOURCE_COLORS: Record<string, string> = {
    bits:      "#f0b830",
    sub:       "#50c060",
    gift_sub:  "#3d8b45",
    raid:      "#e8508a",
    donation:  "#c8960a",
    other:     "#7a9e78",
};

const SOURCE_LABELS: Record<string, string> = {
    bits: "Bits", sub: "Sub", gift_sub: "Gift Sub",
    raid: "Raid", donation: "Don", other: "Autre",
};

type RevenueSource = Revenue["source"];

// ── Tooltip custom ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "#0d1a10", border: "1px solid #2a5c3088",
            borderRadius: 8, padding: "0.6rem 1rem",
            fontFamily: "var(--font-title)", fontSize: "0.72rem",
        }}>
            <p style={{ color: "var(--gold-light)", marginBottom: 4 }}>{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color ?? "var(--green-glow)" }}>
                    {p.name}: {p.value} €
                </p>
            ))}
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function FinancePage() {
    const [revenues, setRevenues] = useState<Revenue[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [form, setForm] = useState({
        source:      "bits" as RevenueSource,
        amount:      "",
        date:        new Date().toISOString().slice(0, 10),
        description: "",
    });

    const load = () => {
        setLoading(true);
        getRevenues()
            .then(setRevenues)
            .catch(() => setError("Impossible de charger les revenus"))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    // ── Submit ──────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!form.amount || isNaN(Number(form.amount))) return;
        await addRevenue({
            source:      form.source,
            amount:      Number(form.amount),
            date:        new Date(form.date).toISOString(),
            description: form.description || undefined,
        });
        setForm({ source: "bits", amount: "", date: new Date().toISOString().slice(0, 10), description: "" });
        setShowForm(false);
        load();
    };

    const handleDelete = async (id: string) => {
        await deleteRevenue(id);
        load();
    };

    // ── Computed ────────────────────────────────────────────────────────────────
    const total = revenues.reduce((s, r) => s + r.amount, 0);

    // Monthly bar chart data
    const byMonth: Record<string, number> = {};
    revenues.forEach(r => {
        const m = r.date.slice(0, 7); // "2025-03"
        byMonth[m] = (byMonth[m] ?? 0) + r.amount;
    });
    const monthlyData = Object.entries(byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, total]) => ({ month: month.slice(5), total }));

    // Pie data by source
    const bySource: Record<string, number> = {};
    revenues.forEach(r => {
        bySource[r.source] = (bySource[r.source] ?? 0) + r.amount;
    });
    const pieData = Object.entries(bySource).map(([source, value]) => ({
        name: SOURCE_LABELS[source] ?? source,
        value,
        color: SOURCE_COLORS[source] ?? "#7a9e78",
    }));

    return (
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.6rem" }}>

            {error && (
                <div style={{
                    color: "var(--rose-glow)", background: "#c0306a18",
                    border: "1px solid #c0306a44", borderRadius: 8,
                    padding: "0.7rem 1.2rem", fontSize: "0.78rem",
                    fontFamily: "var(--font-title)",
                }}>⚠ {error}</div>
            )}

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
                <KpiCard label="Total revenus"  value={`${total.toFixed(2)} €`}                        icon="💰" accent="gold"  />
                <KpiCard label="Ce mois"        value={`${monthTotal(revenues).toFixed(2)} €`}         icon="📅" accent="green" />
                <KpiCard label="Entrées"        value={`${revenues.length}`}                           icon="📊" accent="rose"  />
                <KpiCard label="Meilleure source" value={bestSource(revenues)}                         icon="🏆" accent="gold"  />
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

                <Panel title="Revenus par mois (6 derniers)" icon="📈" delay={80}>
                    {monthlyData.length === 0
                        ? <NoData />
                        : (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                    <XAxis dataKey="month" tick={{ fill: "#7a9e78", fontSize: 11, fontFamily: "var(--font-title)" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "#7a9e78", fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#2a5c3033" }} />
                                    <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
                                        {monthlyData.map((_, i) => (
                                            <Cell key={i} fill={i === monthlyData.length - 1 ? "#f0b830" : "#3d8b45"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    }
                </Panel>

                <Panel title="Répartition" icon="🥧" delay={140}>
                    {pieData.length === 0
                        ? <NoData />
                        : (
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" cx="50%" cy="45%" outerRadius={60} innerRadius={30}>
                                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(v: number) => `${v} €`} contentStyle={{ background: "#0d1a10", border: "1px solid #2a5c3088", fontFamily: "var(--font-title)", fontSize: 11 }} />
                                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-title)", color: "#7a9e78" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        )
                    }
                </Panel>
            </div>

            {/* Transaction list + Add button */}
            <Panel title="Historique des revenus" icon="📜" delay={200}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.8rem" }}>
                    <button
                        onClick={() => setShowForm(v => !v)}
                        style={{
                            background: showForm ? "#c0306a22" : "#1a3a1e",
                            border: `1px solid ${showForm ? "#e8508a66" : "#2a5c3066"}`,
                            color: showForm ? "var(--rose-glow)" : "var(--green-glow)",
                            borderRadius: 8, padding: "0.4rem 1.1rem",
                            fontSize: "0.7rem", letterSpacing: "0.1em",
                            textTransform: "uppercase", fontFamily: "var(--font-title)",
                            cursor: "pointer", transition: "all 0.2s",
                        }}
                    >
                        {showForm ? "✕ Annuler" : "+ Ajouter un revenu"}
                    </button>
                </div>

                {/* Add form */}
                {showForm && (
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                        gap: 10, marginBottom: "1rem",
                        padding: "1rem", background: "#0d1a1088",
                        border: "1px solid #2a5c3044", borderRadius: 10,
                    }}>
                        <Field label="Source">
                            <select
                                value={form.source}
                                onChange={e => setForm(f => ({ ...f, source: e.target.value as RevenueSource }))}
                                style={inputStyle}
                            >
                                {Object.entries(SOURCE_LABELS).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Montant (€)">
                            <input
                                type="number" min="0" step="0.01"
                                value={form.amount}
                                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                                placeholder="0.00"
                                style={inputStyle}
                            />
                        </Field>
                        <Field label="Date">
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                style={inputStyle}
                            />
                        </Field>
                        <Field label="Description (optionnel)">
                            <input
                                type="text"
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="ex: Sub de ShadowScale"
                                style={inputStyle}
                            />
                        </Field>
                        <Field label=" ">
                            <button onClick={handleSubmit} style={{
                                ...inputStyle,
                                background: "#1a5c20", borderColor: "#50c06066",
                                color: "var(--green-glow)", cursor: "pointer",
                                fontWeight: 700, letterSpacing: "0.1em",
                            }}>
                                ✓ Enregistrer
                            </button>
                        </Field>
                    </div>
                )}

                {/* Table */}
                {loading
                    ? <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-title)", fontSize: "0.8rem" }}>Chargement…</p>
                    : revenues.length === 0
                        ? <NoData />
                        : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                    <tr>
                                        {["Date", "Source", "Montant", "Description", ""].map(h => (
                                            <th key={h} style={{
                                                textAlign: "left", padding: "0.4rem 0.6rem",
                                                color: "var(--text-dim)", fontSize: "0.65rem",
                                                textTransform: "uppercase", letterSpacing: "0.1em",
                                                fontFamily: "var(--font-title)", fontWeight: 600,
                                                borderBottom: "1px solid #2a5c3044",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[...revenues]
                                        .sort((a, b) => b.date.localeCompare(a.date))
                                        .map((r, i) => (
                                            <tr key={r.id} style={{ opacity: 0, animation: `fadeSlideUp 0.3s ease ${i * 30}ms both` }}>
                                                <td style={tdStyle}>{new Date(r.date).toLocaleDateString("fr-FR")}</td>
                                                <td style={tdStyle}>
                            <span style={{
                                color: SOURCE_COLORS[r.source] ?? "var(--text)",
                                background: `${SOURCE_COLORS[r.source] ?? "#7a9e78"}18`,
                                border: `1px solid ${SOURCE_COLORS[r.source] ?? "#7a9e78"}33`,
                                borderRadius: 4, padding: "1px 7px",
                                fontSize: "0.65rem", letterSpacing: "0.08em",
                                textTransform: "uppercase", fontFamily: "var(--font-title)",
                            }}>
                              {SOURCE_LABELS[r.source] ?? r.source}
                            </span>
                                                </td>
                                                <td style={{ ...tdStyle, color: "var(--gold-light)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                                    {r.amount.toFixed(2)} €
                                                </td>
                                                <td style={{ ...tdStyle, color: "var(--text-dim)" }}>{r.description ?? "—"}</td>
                                                <td style={tdStyle}>
                                                    <button
                                                        onClick={() => handleDelete(r.id)}
                                                        style={{
                                                            background: "transparent", border: "none",
                                                            color: "#c0306a88", cursor: "pointer",
                                                            fontSize: "0.8rem", padding: "2px 6px",
                                                            borderRadius: 4, transition: "color 0.2s",
                                                        }}
                                                        onMouseEnter={e => (e.currentTarget.style.color = "#e8508a")}
                                                        onMouseLeave={e => (e.currentTarget.style.color = "#c0306a88")}
                                                    >✕</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                }
            </Panel>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function monthTotal(revenues: Revenue[]) {
    const now = new Date().toISOString().slice(0, 7);
    return revenues.filter(r => r.date.startsWith(now)).reduce((s, r) => s + r.amount, 0);
}

function bestSource(revenues: Revenue[]) {
    const by: Record<string, number> = {};
    revenues.forEach(r => { by[r.source] = (by[r.source] ?? 0) + r.amount; });
    const top = Object.entries(by).sort(([, a], [, b]) => b - a)[0];
    return top ? (SOURCE_LABELS[top[0]] ?? top[0]) : "—";
}

function KpiCard({ label, value, icon, accent }: { label: string; value: string; icon: string; accent: "gold" | "green" | "rose" }) {
    const color =
        accent === "gold" ? "var(--gold-light)" :
            accent === "rose" ? "var(--rose-glow)"  : "var(--green-glow)";
    return (
        <div className="anim-enter" style={{
            background: "linear-gradient(135deg, var(--bg-panel), var(--scale1))",
            border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
            borderRadius: 12, padding: "1.1rem 1.3rem",
        }}>
            <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{icon}</div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.67rem", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-title)" }}>
                {label}
            </div>
            <div style={{ color, fontSize: "1.5rem", fontFamily: "var(--font-display)", fontWeight: 700, textShadow: `0 0 16px color-mix(in srgb, ${color} 40%, transparent)` }}>
                {value}
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ color: "var(--text-dim)", fontSize: "0.63rem", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-title)" }}>
                {label}
            </label>
            {children}
        </div>
    );
}

function NoData() {
    return <p style={{ color: "var(--text-dim)", fontFamily: "var(--font-title)", fontSize: "0.78rem", textAlign: "center", padding: "1.5rem 0" }}>Aucune donnée encore — ajoute ton premier revenu !</p>;
}

const inputStyle: React.CSSProperties = {
    background: "#0a0f0a", border: "1px solid #2a5c3066",
    borderRadius: 6, color: "var(--text)",
    fontFamily: "var(--font-title)", fontSize: "0.75rem",
    padding: "0.4rem 0.7rem", width: "100%",
    outline: "none",
};

const tdStyle: React.CSSProperties = {
    padding: "0.45rem 0.6rem",
    borderBottom: "1px solid #2a5c3022",
    color: "var(--text)", fontSize: "0.78rem",
    fontFamily: "var(--font-title)", verticalAlign: "middle",
};