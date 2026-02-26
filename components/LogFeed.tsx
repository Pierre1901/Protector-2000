export type LogEntry = {
    id: string;
    type: "info" | "warn" | "ban" | "twitch" | "sub" | "unban";
    text: string;
    reason?: string;
    time: string;
};

const typeStyles = {
    info:   { border: "border-l-[#4aff8c]/60",  icon: "✅" },
    warn:   { border: "border-l-yellow-400/60",  icon: "⚠️" },
    ban:    { border: "border-l-red-500/60",     icon: "🔨" },
    unban:  { border: "border-l-blue-400/60",    icon: "🔓" },
    twitch: { border: "border-l-purple-400/60",  icon: "📡" },
    sub:    { border: "border-l-[#4aff8c]/60",   icon: "🎖️" },
};

const MOCK_LOGS: LogEntry[] = [
    { id: "1", type: "ban",    text: "DragonSlayer99 banni par Marouette",        reason: "Spam répété",               time: "il y a 12 min" },
    { id: "2", type: "warn",   text: "ChaosGremlin — avertissement",              reason: "Langage inapproprié",        time: "il y a 28 min" },
    { id: "3", type: "sub",    text: "Rôle Sub attribué à HunterX42",             reason: "Abonnement Twitch détecté",  time: "il y a 1h" },
    { id: "4", type: "info",   text: "Rôle Viewer donné à NoviceHunter",          time: "il y a 1h" },
    { id: "5", type: "twitch", text: "EventSub enregistré : stream.online",       time: "il y a 2h" },
    { id: "6", type: "info",   text: "RATHIAN éveillé — connexion établie",       time: "il y a 2h" },
];

export default function LogFeed({ logs = MOCK_LOGS }: { logs?: LogEntry[] }) {
    return (
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
            {logs.map((log, i) => {
                const style = typeStyles[log.type];
                return (
                    <div
                        key={log.id}
                        className={`flex items-start gap-3 px-3 py-2.5 bg-white/[0.02] border border-[#1a2a1a] border-l-2 ${style.border} rounded-sm text-sm`}
                        style={{ animation: `fadeIn 0.3s ${i * 0.05}s both` }}
                    >
                        <span className="text-base flex-shrink-0 mt-0.5">{style.icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="text-[#b0c4b0] leading-snug">{log.text}</div>
                            {log.reason && (
                                <div className="text-[11px] text-[#3a5a3a] font-mono mt-0.5 italic">{log.reason}</div>
                            )}
                        </div>
                        <div className="text-[10px] font-mono text-[#2a4a2a] whitespace-nowrap mt-0.5">{log.time}</div>
                    </div>
                );
            })}
        </div>
    );
}