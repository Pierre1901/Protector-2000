import { useEffect, useState } from "react";
import { getStats, getMembers, type Stats, type Member } from "../api/Client";
import { StatCard, Panel } from "../components/Ui";

const SOURCE_LABELS: Record<string, string> = {
    bits: "Bits", sub: "Sub", gift_sub: "Gift Sub",
    raid: "Raid", donation: "Don", other: "Autre",
};

export default function HomePage() {
    const [stats,   setStats]   = useState<Stats | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    useEffect(() => {
        Promise.all([getStats(), getMembers()])
            .then(([s, m]) => { setStats(s); setMembers(m); })
            .catch(() => setError("Impossible de joindre le bot"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.6rem" }}>

            {error && (
                <div style={{
                    color: "var(--rose-glow)", background: "#c0306a18",
                    border: "1px solid #c0306a44", borderRadius: 8,
                    padding: "0.7rem 1.2rem", fontSize: "0.78rem",
                    fontFamily: "var(--font-title)",
                }}>⚠ {error} — vérifie que le bot tourne sur le port 3002</div>
            )}

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
                <StatCard label="Membres"  value={loading ? undefined : stats?.members} icon="🐉" accent="green" delay={0}   />
                <StatCard label="Viewers"  value={loading ? undefined : stats?.viewers} icon="👁"  accent="gold"  delay={80}  />
                <StatCard label="Subs"     value={loading ? undefined : stats?.subs}    icon="⚔"  accent="rose"  delay={160} />
                <StatCard label="Warns"    value={loading ? undefined : stats?.warns}   icon="⚡"  accent="gold"  delay={240} />
                <StatCard label="Bans"     value={loading ? undefined : stats?.bans}    icon="🔥"  accent="rose"  delay={320} />
            </div>

            {/* Bottom grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                {/* Members list */}
                <Panel title="Derniers membres" icon="🛡" delay={100}>
                    {loading
                        ? <Placeholder />
                        : members.length === 0
                            ? <Empty msg="Aucun membre trouvé" />
                            : members.map((m, i) => <MemberRow key={m.id} member={m} index={i} />)
                    }
                </Panel>

                {/* Activity log */}
                <Panel title="Journal d'activité" icon="📜" delay={180}>
                    {LOG_ENTRIES.map((e, i) => (
                        <div key={i} style={{
                            display: "flex", gap: 10,
                            padding: "0.4rem 0",
                            borderBottom: "1px solid #2a5c3022",
                        }}>
              <span style={{ color: "var(--text-dim)", fontSize: "0.65rem", fontFamily: "var(--font-title)", whiteSpace: "nowrap" }}>
                {e.time}
              </span>
                            <span style={{ color: e.color, fontSize: "0.72rem", fontFamily: "var(--font-title)", lineHeight: 1.4 }}>
                {e.msg}
              </span>
                        </div>
                    ))}
                </Panel>
            </div>
        </div>
    );
}

// ── Sub components ────────────────────────────────────────────────────────────

function MemberRow({ member, index }: { member: Member; index: number }) {
    const roleColor =
        member.role === "sub"    ? "var(--gold-light)" :
            member.role === "viewer" ? "var(--green-glow)" : "var(--text-dim)";
    return (
        <div
            className="anim-enter"
            style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "0.55rem 0.6rem",
                borderBottom: "1px solid #2a5c3033",
                animationDelay: `${index * 50}ms`,
            }}
        >
            <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--scale2), var(--scale1))",
                border: `1.5px solid color-mix(in srgb, ${roleColor} 40%, transparent)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.72rem", color: roleColor, fontWeight: 700,
                fontFamily: "var(--font-title)",
            }}>
                {member.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span style={{ flex: 1, color: "var(--text)", fontSize: "0.83rem", fontFamily: "var(--font-title)" }}>
        {member.name}
      </span>
            <span style={{
                color: roleColor, fontSize: "0.62rem",
                textTransform: "uppercase", letterSpacing: "0.1em",
                background: `color-mix(in srgb, ${roleColor} 12%, transparent)`,
                borderRadius: 4, padding: "2px 8px",
                border: `1px solid color-mix(in srgb, ${roleColor} 30%, transparent)`,
            }}>
        {member.role}
      </span>
        </div>
    );
}

function Placeholder() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    height: 38, borderRadius: 6,
                    background: "linear-gradient(90deg, var(--scale1), var(--scale2), var(--scale1))",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    opacity: 0.6,
                }} />
            ))}
        </div>
    );
}

function Empty({ msg }: { msg: string }) {
    return <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", fontFamily: "var(--font-title)" }}>{msg}</p>;
}

const LOG_ENTRIES = [
    { time: "—:——", msg: "Bot démarré avec succès",       color: "var(--text-dim)" },
    { time: "—:——", msg: "API serveur en ligne :3002",     color: "var(--text-dim)" },
    { time: "—:——", msg: "Dashboard Rathian connecté",     color: "var(--green-glow)" },
];