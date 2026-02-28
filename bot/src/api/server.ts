import express from "express";
import cors from "cors";
import { client } from "../client";
import { config } from "../config";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET"],
}));

app.use((req, res, next) => {
    const key = req.headers["x-api-key"];
    if (key !== process.env.API_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
});


app.get("/api/stats", async (req, res) => {
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return res.json({ members: 0, viewers: 0, subs: 0, warns: 0, bans: 0 });

        await guild.members.fetch();

        const viewerRole = guild.roles.cache.get(config.viewerRoleId);
        const subRole    = guild.roles.cache.get(config.subRoleId);

        res.json({
            members: guild.memberCount,
            viewers: viewerRole?.members.size ?? 0,
            subs:    subRole?.members.size ?? 0,
            warns:   0,
            bans:    0,
        });
    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
});

app.get("/api/members", async (req, res) => {
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return res.json([]);

        await guild.members.fetch();

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
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export function startApiServer() {
    const PORT = 3002;
    app.listen(PORT, () => {
        console.log(`🔌 API server démarré sur le port ${PORT}`);
    });
}