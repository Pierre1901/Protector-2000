import { useState } from "react";
import { login } from "../api/Client";
import { DragonEye } from "../components/Ui";

interface LoginPageProps {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState<string | null>(null);
    const [loading,  setLoading]  = useState(false);
    const [blinking] = useState(false);

    const handleSubmit = async () => {
        if (!password) return;
        setLoading(true);
        setError(null);
        try {
            await login(password);
            onLogin();
        } catch {
            setError("Mot de passe incorrect");
            setPassword("");
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: `
                radial-gradient(ellipse at 30% 20%, #2a5c3018 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, #c0306a0e 0%, transparent 50%),
                #0a0f0a
            `,
        }}>
            <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem",
                padding: "3rem 2.5rem",
                background: "linear-gradient(160deg, #0d1a10, #0a0f0a)",
                border: "1px solid #2a5c3088",
                borderRadius: 20,
                position: "relative",
                overflow: "hidden",
                width: "100%", maxWidth: 380,
                animation: "fadeSlideUp 0.5s ease both",
            }}>
                {/* Top gold line */}
                <div style={{
                    position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
                    background: "linear-gradient(90deg, transparent, #c8960a, transparent)",
                }} />
                {/* Bottom rose line */}
                <div style={{
                    position: "absolute", bottom: 0, left: "20%", right: "20%", height: 1,
                    background: "linear-gradient(90deg, transparent, #c0306a66, transparent)",
                }} />

                {/* Eye + rings */}
                <div style={{ position: "relative", width: 110, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 100 100" style={{ position: "absolute", width: 110, height: 110, animation: "rotate 20s linear infinite" }}>
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#c8960a" strokeWidth="0.8" strokeDasharray="8 4" opacity="0.5" />
                        {[0,60,120,180,240,300].map(angle => {
                            const rad = (angle * Math.PI) / 180;
                            return <circle key={angle} cx={50 + 46 * Math.cos(rad)} cy={50 + 46 * Math.sin(rad)} r="1.5" fill="#f0b830" opacity="0.8" />;
                        })}
                    </svg>
                    <svg viewBox="0 0 100 100" style={{ position: "absolute", width: 88, height: 88, animation: "rotateCCW 12s linear infinite" }}>
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#c0306a" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.6" />
                    </svg>
                    <DragonEye blinking={blinking} />
                </div>

                {/* Title */}
                <div style={{ textAlign: "center" }}>
                    <h1 style={{
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: "2rem", color: "#f0b830",
                        textShadow: "0 0 30px #c8960a88",
                        letterSpacing: "0.08em", lineHeight: 1,
                    }}>RATHIAN</h1>
                    <div style={{
                        color: "#7a9e78", fontSize: "0.62rem",
                        letterSpacing: "0.28em", textTransform: "uppercase",
                        fontFamily: "'Cinzel', serif", marginTop: 6,
                    }}>Accès sécurisé</div>
                </div>

                {/* Input */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{
                        color: "#7a9e78", fontSize: "0.65rem",
                        textTransform: "uppercase", letterSpacing: "0.15em",
                        fontFamily: "'Cinzel', serif",
                    }}>
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={handleKey}
                        autoFocus
                        placeholder="••••••••"
                        style={{
                            background: "#060d06",
                            border: `1px solid ${error ? "#c0306a88" : "#2a5c3066"}`,
                            borderRadius: 8,
                            color: "#d4e8c8",
                            fontFamily: "'Cinzel', serif",
                            fontSize: "0.9rem",
                            letterSpacing: "0.2em",
                            padding: "0.7rem 1rem",
                            outline: "none",
                            width: "100%",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "#50c06066"}
                        onBlur={e  => e.currentTarget.style.borderColor = error ? "#c0306a88" : "#2a5c3066"}
                    />
                    {error && (
                        <span style={{
                            color: "#e8508a", fontSize: "0.68rem",
                            fontFamily: "'Cinzel', serif",
                            animation: "fadeSlideUp 0.2s ease both",
                        }}>
                            ⚠ {error}
                        </span>
                    )}
                </div>

                {/* Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading || !password}
                    style={{
                        width: "100%",
                        background: loading ? "#1a3a1e" : "linear-gradient(135deg, #1a5c20, #2a8030)",
                        border: "1px solid #50c06066",
                        borderRadius: 10,
                        color: loading ? "#7a9e78" : "#50c060",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.75rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        padding: "0.75rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: loading ? "none" : "0 0 20px #50c06022",
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 0 30px #50c06044"; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = "0 0 20px #50c06022"; }}
                >
                    {loading ? "Vérification…" : "Entrer"}
                </button>
            </div>
        </div>
    );
}