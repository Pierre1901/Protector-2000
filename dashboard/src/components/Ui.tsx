import { useEffect, useRef, useState } from "react";

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
    const svgRef = useRef<SVGSVGElement>(null);
    const [pupil, setPupil] = useState({ x: 0, y: 0 });
    const [pulse, setPulse] = useState(0);

    // Suivi souris
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const svg = svgRef.current;
            if (!svg) return;
            const rect = svg.getBoundingClientRect();
            const cx = rect.left + rect.width  * 0.5;
            const cy = rect.top  + rect.height * 0.5;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const norm = Math.min(dist, 220) / 220;
            setPupil({ x: (dx / dist) * norm * 7, y: (dy / dist) * norm * 4 });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Pulsation des veines
    useEffect(() => {
        let frame: number;
        let t = 0;
        const animate = () => {
            t += 0.025;
            setPulse(Math.sin(t) * 0.5 + 0.5); // 0 → 1
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    const ix = 60 + pupil.x;
    const iy = 40 + pupil.y;

    // Veines : lignes rayonnantes depuis l'iris
    const veins = [
        "M60,40 Q50,28 38,22", "M60,40 Q72,28 84,22",
        "M60,40 Q48,44 34,48", "M60,40 Q72,44 86,48",
        "M60,40 Q55,30 44,18", "M60,40 Q65,30 76,18",
        "M60,40 Q54,48 42,56", "M60,40 Q66,48 78,56",
    ];

    const veinOpacity = 0.15 + pulse * 0.35;
    const glowSize    = 1.2 + pulse * 0.8;

    return (
        <svg ref={svgRef} viewBox="0 0 120 80" style={{ width: 120, height: 80, overflow: "visible" }}>
            <defs>
                {/* Halo externe vert acide */}
                <radialGradient id="eyeHalo" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#50c060" stopOpacity="0" />
                    <stop offset="55%"  stopColor="#50c060" stopOpacity={0.08 + pulse * 0.12} />
                    <stop offset="100%" stopColor="#50c060" stopOpacity="0" />
                </radialGradient>

                {/* Sclera sombre organique */}
                <radialGradient id="scleraG" cx="50%" cy="35%" r="60%">
                    <stop offset="0%"   stopColor="#12100a" />
                    <stop offset="100%" stopColor="#060502" />
                </radialGradient>

                {/* Iris doré/ambre */}
                <radialGradient id="irisG" cx="50%" cy="45%" r="55%">
                    <stop offset="0%"   stopColor="#3a1e00" />
                    <stop offset="30%"  stopColor="#7a4200" />
                    <stop offset="65%"  stopColor="#c8780a" />
                    <stop offset="85%"  stopColor="#f0a020" />
                    <stop offset="100%" stopColor="#ffe060" />
                </radialGradient>

                {/* Anneau limbique vert acide */}
                <radialGradient id="limbusG" cx="50%" cy="50%" r="50%">
                    <stop offset="75%"  stopColor="transparent" />
                    <stop offset="90%"  stopColor="#50c060" stopOpacity={0.5 + pulse * 0.4} />
                    <stop offset="100%" stopColor="#50c060" stopOpacity="0" />
                </radialGradient>

                <filter id="blurSoft"><feGaussianBlur stdDeviation="2.5" /></filter>
                <filter id="glowGold">
                    <feGaussianBlur stdDeviation={glowSize} result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glowGreen">
                    <feGaussianBlur stdDeviation="1.2" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                <clipPath id="eyeClip">
                    <ellipse cx="60" cy="40" rx="51" ry="27" />
                </clipPath>
            </defs>

            {/* ── Halo ambiant externe ── */}
            <ellipse cx="60" cy="40" rx="64" ry="38" fill="url(#eyeHalo)" filter="url(#blurSoft)" />

            {/* ── Sclera ── */}
            <ellipse cx="60" cy="40" rx="51" ry="27" fill="url(#scleraG)" />

            {/* ── Veines vert acide (clipées) ── */}
            <g clipPath="url(#eyeClip)" filter="url(#glowGreen)">
                {veins.map((d, i) => (
                    <path
                        key={i}
                        d={d}
                        fill="none"
                        stroke="#50c060"
                        strokeWidth="0.6"
                        opacity={veinOpacity * (0.6 + (i % 3) * 0.2)}
                        strokeLinecap="round"
                    />
                ))}
            </g>

            {/* ── Iris doré (suit la souris) ── */}
            <g clipPath="url(#eyeClip)">
                <circle cx={ix} cy={iy} r="19" fill="url(#irisG)" filter="url(#glowGold)" />

                {/* Anneau limbique vert acide */}
                <circle cx={ix} cy={iy} r="19" fill="url(#limbusG)" />

                {/* Détails iris — stries radiales */}
                {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
                    const rad = (a * Math.PI) / 180;
                    return (
                        <line
                            key={a}
                            x1={ix + 7  * Math.cos(rad)} y1={iy + 7  * Math.sin(rad)}
                            x2={ix + 17 * Math.cos(rad)} y2={iy + 17 * Math.sin(rad)}
                            stroke="#f0a02044" strokeWidth="0.5"
                        />
                    );
                })}

                {/* Anneau interne or */}
                <circle cx={ix} cy={iy} r="8" fill="none" stroke="#ffe06066" strokeWidth="0.8" />

                {/* Pupille fente verticale */}
                <ellipse
                    cx={ix} cy={iy}
                    rx={blinking ? 1.5 : 3}
                    ry={blinking ? 1   : 14}
                    fill="#000"
                    style={{ transition: "ry 0.1s ease" }}
                />

                {/* Reflet primaire */}
                <ellipse
                    cx={ix - 4} cy={iy - 5}
                    rx="2.2" ry="3.2"
                    fill="white" opacity="0.18"
                    transform={`rotate(-25 ${ix - 4} ${iy - 5})`}
                />
                {/* Petit reflet secondaire */}
                <circle cx={ix + 5} cy={iy + 4} r="1" fill="white" opacity="0.08" />
            </g>

            {/* ── Bord de l'œil — contour écailles or ── */}
            <ellipse cx="60" cy="40" rx="51" ry="27" fill="none"
                     stroke="#c8960a" strokeWidth="1.4" opacity="0.8" />

            {/* ── Paupières courbes ── */}
            <path d="M9,40 Q60,-6 111,40"
                  fill="none" stroke="#c8960a" strokeWidth="1" opacity="0.5" />
            <path d="M9,40 Q60,86 111,40"
                  fill="none" stroke="#c8960a" strokeWidth="1" opacity="0.5" />

            {/* ── Coins — écailles ── */}
            <polygon points="9,40 14,36 14,44"   fill="#c8960a" opacity="0.7" />
            <polygon points="111,40 106,36 106,44" fill="#c8960a" opacity="0.7" />
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
    onLogout: () => void;
}

export function Navbar({ blinking, live, currentPage, onNavigate, onLogout }: NavbarProps) {
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

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <TwitchStatus live={live} />
                <button
                    onClick={onLogout}
                    style={{
                        background: "transparent",
                        border: "1px solid #2a5c3044",
                        borderRadius: 8,
                        color: "#7a9e78",
                        fontSize: "0.68rem", letterSpacing: "0.1em",
                        textTransform: "uppercase", fontFamily: "var(--font-title)",
                        padding: "0.45rem 0.9rem",
                        cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0306a66"; e.currentTarget.style.color = "#e8508a"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a5c3044"; e.currentTarget.style.color = "#7a9e78"; }}
                >
                    ⎋ Quitter
                </button>
            </div>
        </header>
    );
}