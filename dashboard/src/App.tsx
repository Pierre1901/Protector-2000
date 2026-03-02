import { useState, useEffect } from "react";
import { Navbar } from "./components/Ui";
import HomePage    from "./pages/Homepage";
import FinancePage from "./pages/Financepage";
import LoginPage   from "./pages/LoginPage";
import { getStats, logout } from "./api/Client";

export default function App() {
    const [page,          setPage]          = useState("home");
    const [blinking,      setBlinking]      = useState(false);
    const [live]                            = useState(false);
    const [authenticated, setAuthenticated] = useState<boolean | null>(null); // null = en cours de vérif

    useEffect(() => {
        getStats()
            .then(() => setAuthenticated(true))
            .catch(() => setAuthenticated(false));
    }, []);

    useEffect(() => {
        const schedule = (): ReturnType<typeof setTimeout> => {
            const delay = Math.random() * 5000 + 2500;
            return setTimeout(() => {
                setBlinking(true);
                setTimeout(() => { setBlinking(false); schedule(); }, 180);
            }, delay);
        };
        const t = schedule();
        return () => clearTimeout(t);
    }, []);

    const handleLogout = async () => {
        await logout();
        setAuthenticated(false);
    };

    if (authenticated === null) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex",
                alignItems: "center", justifyContent: "center",
                background: "#0a0f0a",
            }}>
                <div style={{
                    color: "#7a9e78", fontFamily: "'Cinzel', serif",
                    fontSize: "0.75rem", letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    animation: "pulse 1.5s infinite",
                }}>
                    Connexion…
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return <LoginPage onLogin={() => setAuthenticated(true)} />;
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
                background: `
                    radial-gradient(ellipse at 15% 0%,   #2a5c3018 0%, transparent 45%),
                    radial-gradient(ellipse at 85% 100%, #c0306a0e 0%, transparent 45%)
                `,
            }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar
                    blinking={blinking}
                    live={live}
                    currentPage={page}
                    onNavigate={setPage}
                    onLogout={handleLogout}
                />

                <main style={{ flex: 1 }}>
                    {page === "home"    && <HomePage />}
                    {page === "finance" && <FinancePage />}
                </main>

                <footer style={{
                    textAlign: "center", padding: "1rem",
                    color: "#7a9e7855", fontSize: "0.58rem",
                    letterSpacing: "0.25em", textTransform: "uppercase",
                    fontFamily: "'Cinzel', serif",
                    borderTop: "1px solid #2a5c3033",
                }}>
                    Rathian Dashboard · Protector-2000 · {new Date().getFullYear()}
                </footer>
            </div>
        </div>
    );
}