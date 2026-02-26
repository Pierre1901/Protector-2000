export type Member = {
    id: string;
    name: string;
    role: "admin" | "mod" | "sub" | "viewer";
    avatar?: string;
};

const roleStyles = {
    admin:  { label: "ADMIN",  cls: "text-red-400 bg-red-500/8 border-red-500/20" },
    mod:    { label: "MOD",    cls: "text-yellow-400 bg-yellow-400/8 border-yellow-400/20" },
    sub:    { label: "SUB",    cls: "text-[#4aff8c] bg-[#4aff8c]/8 border-[#4aff8c]/20" },
    viewer: { label: "VIEWER", cls: "text-blue-400 bg-blue-400/8 border-blue-400/20" },
};

const AVATARS = ["🗡️", "🛡️", "🏹", "⚔️", "🔥", "💀", "🐉", "⚡"];

const MOCK_MEMBERS: Member[] = [
    { id: "1", name: "HunterX42",     role: "sub" },
    { id: "2", name: "IronWarden",    role: "mod" },
    { id: "3", name: "NoviceHunter",  role: "viewer" },
    { id: "4", name: "BladeRunner7",  role: "sub" },
    { id: "5", name: "EmberWolf",     role: "viewer" },
    { id: "6", name: "ShadowCrawler", role: "viewer" },
];

export default function MemberList({ members = MOCK_MEMBERS }: { members?: Member[] }) {
    return (
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
            {members.map((m, i) => {
                const role = roleStyles[m.role];
                const avatar = AVATARS[i % AVATARS.length];
                return (
                    <div
                        key={m.id}
                        className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] border border-[#1a2a1a] rounded-sm hover:bg-[#4aff8c]/3 transition-colors duration-150"
                    >
                        <div className="w-7 h-7 rounded-full bg-[#0a1a0a] border border-[#1a2a1a] flex items-center justify-center text-xs flex-shrink-0">
                            {avatar}
                        </div>
                        <div className="flex-1 text-sm text-[#b0c4b0] font-mono">{m.name}</div>
                        <span className={`text-[9px] font-mono tracking-wider px-2 py-0.5 border rounded-sm ${role.cls}`}>
              {role.label}
            </span>
                    </div>
                );
            })}
        </div>
    );
}