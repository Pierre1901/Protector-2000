import { useEffect, useState } from "react";

// ── Scale SVG background ──────────────────────────────────────────────────────
export const scaleBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cellipse cx='20' cy='20' rx='18' ry='12' fill='none' stroke='%232a5c30' stroke-width='0.6' opacity='0.35'/%3E%3C/svg%3E")`;

// ── Panel ─────────────────────────────────────────────────────────────────────
interface PanelProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    delay?: number;
}

export function Panel({ title, icon, children, style = {}, delay = 0 }: PanelProps) {
    return (
        <div
            className="anim-enter"
            style={{
                background: "linear-gradient(160deg, var(--bg-panel) 0%, var(--bg) 100%)",
                border: "1px solid #2a5c3088",
                borderRadius: 16,
                padding: "1.4rem",
                backgroundImage: scaleBg,
                position: "relative",
                overflow: "hidden",
                animationDelay: `${delay}ms`,
                ...style,
            }}
        >
            {/* top gold line */}
            <div style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
                background: "linear-gradient(90deg, transparent, #c8960a88, transparent)",
            }} />
            <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: "1.1rem", paddingBottom: "0.7rem",
                borderBottom: "1px solid #2a5c3044",
            }}>
                <span style={{ fontSize: "1rem" }}>{icon}</span>
                <span style={{
                    color: "var(--gold-light)", fontSize: "0.7rem",
                    textTransform: "uppercase", letterSpacing: "0.2em",
                    fontFamily: "var(--font-title)", fontWeight: 600,
                }}>{title}</span>
            </div>
            {children}
        </div>
    );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
interface StatCardProps {
    label: string;
    value: number | string | null | undefined;
    icon: string;
    accent: "green" | "gold" | "rose";
    delay?: number;
}

export function StatCard({ label, value, icon, accent, delay = 0 }: StatCardProps) {
    const [displayed, setDisplayed] = useState(0);

    const accentColor =
        accent === "gold" ? "var(--gold-light)" :
            accent === "rose" ? "var(--rose-glow)"  : "var(--green-glow)";

    useEffect(() => {
        if (typeof value !== "number") return;
        const steps = 40;
        const inc = value / steps;
        let step = 0;
        const t = setInterval(() => {
            step++;
            setDisplayed(Math.round(inc * step));
            if (step >= steps) clearInterval(t);
        }, 1200 / steps);
        return () => clearInterval(t);
    }, [value]);

    return (
        <div
            className="anim-enter"
            style={{
                background: "linear-gradient(135deg, var(--bg-panel), var(--scale1))",
                border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
                borderRadius: 12,
                padding: "1.2rem 1.4rem",
                position: "relative",
                overflow: "hidden",
                animationDelay: `${delay}ms`,
            }}
        >
            <div style={{
                position: "absolute", top: 0, right: 0, width: 60, height: 60,
                background: `radial-gradient(circle at top right, color-mix(in srgb, ${accentColor} 15%, transparent), transparent 70%)`,
            }} />
            <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{icon}</div>
            <div style={{
                color: "var(--text-dim)", fontSize: "0.68rem",
                letterSpacing: "0.15em", textTransform: "uppercase",
                fontFamily: "var(--font-title)",
            }}>{label}</div>
            <div style={{
                color: accentColor, fontSize: "2.1rem",
                fontFamily: "var(--font-display)", fontWeight: 700,
                lineHeight: 1.1, textShadow: `0 0 20px color-mix(in srgb, ${accentColor} 50%, transparent)`,
            }}>
                {typeof value === "number" ? displayed : (value ?? "—")}
            </div>
        </div>
    );
}

// ── Dragon Eye ────────────────────────────────────────────────────────────────
export function DragonEye({ blinking }: { blinking: boolean }) {
    return (
        <svg viewBox="0 0 120 80" style={{ width: 120, height: 80 }}>
            <defs>
                <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#e8508a" stopOpacity="0.8" />
                    <stop offset="60%"  stopColor="#c0306a" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#c0306a" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="irisg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#1a0a05" />
                    <stop offset="40%"  stopColor="#3d1008" />
                    <stop offset="70%"  stopColor="#c0306a" />
                    <stop offset="100%" stopColor="#e8508a" />
                </radialGradient>
                <filter id="eyeBlur"><feGaussianBlur stdDeviation="2" /></filter>
                <clipPath id="eyeClip"><ellipse cx="60" cy="40" rx="52" ry="28" /></clipPath>
            </defs>
            <ellipse cx="60" cy="40" rx="58" ry="34" fill="url(#eyeGlow)" filter="url(#eyeBlur)" />
            <ellipse cx="60" cy="40" rx="52" ry="28" fill="#0d0805" stroke="#c8960a" strokeWidth="1.5" />
            <g clipPath="url(#eyeClip)">
                <circle cx="60" cy="40" r="20" fill="url(#irisg)" />
                <ellipse cx="60" cy="40" rx={blinking ? 3 : 4} ry={blinking ? 2 : 16} fill="#050202" />
                <ellipse cx="55" cy="34" rx="3" ry="4" fill="white" opacity="0.25" transform="rotate(-20 55 34)" />
            </g>
            <path d="M8,40 Q60,-8 112,40"  fill="none" stroke="#c8960a" strokeWidth="1.2" opacity="0.6" />
            <path d="M8,40 Q60,88 112,40"  fill="none" stroke="#c8960a" strokeWidth="1.2" opacity="0.6" />
        </svg>
    );
}

// ── Twitch Status badge ───────────────────────────────────────────────────────
export function TwitchStatus({ live }: { live: boolean }) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0.45rem 1rem",
            background: live ? "#c0306a22" : "#1a3a1e88",
            border: `1px solid ${live ? "#e8508a" : "#2a5c30"}66`,
            borderRadius: 8,
        }}>
            <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: live ? "#e8508a" : "#7a9e78",
                boxShadow: live ? "0 0 8px #e8508a" : "none",
                animation: live ? "pulse 1.5s infinite" : "none",
            }} />
            <span style={{
                color: live ? "#e8508a" : "#7a9e78",
                fontSize: "0.72rem", letterSpacing: "0.12em",
                textTransform: "uppercase", fontFamily: "var(--font-title)",
            }}>
        {live ? "En direct" : "Hors ligne"}
      </span>
        </div>
    );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
interface NavbarProps {
    blinking: boolean;
    live: boolean;
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function Navbar({ blinking, live, currentPage, onNavigate }: NavbarProps) {
    const navItems = [
        { id: "home",    label: "Vue générale", icon: "🐉" },
        { id: "finance", label: "Finance",      icon: "💰" },
    ];

    return (
        <header style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "1.2rem 2rem",
            borderBottom: "1px solid #2a5c3066",
            position: "relative",
            background: "linear-gradient(180deg, #0d1a10 0%, transparent 100%)",
        }}>
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, #c8960a88, #c0306a88, transparent)",
            }} />

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ position: "relative", width: 80, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 100 100" style={{ position: "absolute", width: 80, height: 80, animation: "rotate 20s linear infinite" }}>
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#c8960a" strokeWidth="0.8" strokeDasharray="8 4" opacity="0.5" />
                        {[0,60,120,180,240,300].map(angle => {
                            const rad = (angle * Math.PI) / 180;
                            return <circle key={angle} cx={50 + 46 * Math.cos(rad)} cy={50 + 46 * Math.sin(rad)} r="1.5" fill="#f0b830" opacity="0.8" />;
                        })}
                    </svg>
                    <svg viewBox="0 0 100 100" style={{ position: "absolute", width: 64, height: 64, animation: "rotateCCW 12s linear infinite" }}>
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#c0306a" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.6" />
                    </svg>
                    <DragonEye blinking={blinking} />
                </div>
                <div>
                    <h1 style={{
                        fontFamily: "var(--font-display)", fontSize: "1.8rem",
                        color: "var(--gold-light)",
                        textShadow: "0 0 30px #c8960a88, 0 2px 4px #000",
                        letterSpacing: "0.05em", lineHeight: 1,
                    }}>RATHIAN</h1>
                    <div style={{
                        color: "var(--text-dim)", fontSize: "0.6rem",
                        letterSpacing: "0.28em", textTransform: "uppercase",
                        fontFamily: "var(--font-title)", marginTop: 3,
                    }}>Dragon Dashboard · v1.0</div>
                </div>
            </div>

            {/* Nav links */}
            <nav style={{ display: "flex", gap: 8 }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        style={{
                            background: currentPage === item.id ? "#2a5c3088" : "transparent",
                            border: `1px solid ${currentPage === item.id ? "#50c06066" : "#2a5c3044"}`,
                            borderRadius: 8,
                            color: currentPage === item.id ? "var(--green-glow)" : "var(--text-dim)",
                            fontSize: "0.72rem", letterSpacing: "0.1em",
                            textTransform: "uppercase", fontFamily: "var(--font-title)",
                            padding: "0.45rem 1rem",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </nav>

            <TwitchStatus live={live} />
        </header>
    );
}