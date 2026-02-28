import { useState, useEffect } from "react";
import { Navbar, DragonEye } from "./components/Ui";
import HomePage    from "./pages/Homepage";
import FinancePage from "./pages/Financepage";

export default function App() {
    const [page,     setPage]     = useState("home");
    const [blinking, setBlinking] = useState(false);
    const [live]                  = useState(false); // TODO: Twitch API

    // Dragon eye random blink
    useEffect(() => {
        const schedule = () => {
            const delay = Math.random() * 5000 + 2500;
            return setTimeout(() => {
                setBlinking(true);
                setTimeout(() => { setBlinking(false); schedule(); }, 180);
            }, delay);
        };
        const t = schedule();
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Ambient background gradients */}
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