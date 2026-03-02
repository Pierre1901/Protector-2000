import express from "express";
import cors from "cors";
import session from "express-session";
import { client } from "../client";
import { config } from "../config";

// ── Typage session ────────────────────────────────────────────────────────────
declare module "express-session" {
    interface SessionData {
        authenticated: boolean;
    }
}

const app = express();
app.use(express.json());
app.use(cors({
    origin:      "http://localhost:3000",
    methods:     ["GET", "POST", "DELETE"],
    credentials: true, // indispensable pour les cookies
}));

// ── Session ───────────────────────────────────────────────────────────────────
app.use(session({
    secret:            process.env.SESSION_SECRET!,
    resave:            false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,   // invisible en JS / devtools
        sameSite: "lax",
        maxAge:   1000 * 60 * 60 * 8, // 8h
    },
}));

// ── Login ─────────────────────────────────────────────────────────────────────
app.post("/api/login", (req, res) => {
    const { password } = req.body as { password?: string };
    if (password === process.env.DASHBOARD_PASSWORD) {
        req.session.authenticated = true;
        return res.json({ ok: true });
    }
    res.status(401).json({ error: "Mot de passe incorrect" });
});

// ── Logout ────────────────────────────────────────────────────────────────────
app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ ok: true });
    });
});

// ── Auth middleware (protège toutes les routes /api sauf login/logout) ────────
app.use("/api", (req, res, next) => {
    if (req.path === "/login" || req.path === "/logout") return next();
    if (!req.session.authenticated) {
        return res.status(401).json({ error: "Non authentifié" });
    }
    next();
});

// ── Stats ─────────────────────────────────────────────────────────────────────
app.get("/api/stats", async (req, res) => {
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return res.json({ members: 0, viewers: 0, subs: 0, warns: 0, bans: 0 });

        const viewerRole = guild.roles.cache.get(config.viewerRoleId);
        const subRole    = guild.roles.cache.get(config.subRoleId);

        res.json({
            members: guild.memberCount,
            viewers: viewerRole?.members.size ?? 0,
            subs:    subRole?.members.size    ?? 0,
            warns:   0,
            bans:    0,
        });
    } catch (e) {
        console.error("STATS ERROR:", e);
        res.status(500).json({ error: "Server Error" });
    }
});

// ── Members ───────────────────────────────────────────────────────────────────
app.get("/api/members", async (req, res) => {
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return res.json([]);

        const members = guild.members.cache
            .filter(m => !m.user.bot)
            .sort((a, b) => (b.joinedTimestamp ?? 0) - (a.joinedTimestamp ?? 0))
            .first(10)
            .map(m => ({
                id:   m.id,
                name: m.user.username,
                role: m.roles.cache.has(config.subRoleId)    ? "sub"
                    : m.roles.cache.has(config.viewerRoleId) ? "viewer"
                        : "viewer",
            }));

        res.json(members);
    } catch (e) {
        console.error("MEMBERS ERROR:", e);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ── Start ─────────────────────────────────────────────────────────────────────
export function startApiServer() {
    const PORT = 3002;
    app.listen(PORT, () => {
        console.log(`🔌 API server démarré sur le port ${PORT}`);
    });
}