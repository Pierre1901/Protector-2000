interface StatCardProps {
    label: string;
    value: string | number;
    sub?: string;
    accent?: "green" | "red" | "blue" | "purple" | "gold";
    delta?: string;
    deltaUp?: boolean;
}

const accentColors = {
    green:  { val: "text-[#4aff8c]",  border: "border-t-[#4aff8c]/40" },
    red:    { val: "text-red-400",     border: "border-t-red-500/40" },
    blue:   { val: "text-blue-400",    border: "border-t-blue-400/40" },
    purple: { val: "text-purple-400",  border: "border-t-purple-400/40" },
    gold:   { val: "text-yellow-400",  border: "border-t-yellow-400/40" },
};

export default function StatCard({ label, value, sub, accent = "green", delta, deltaUp }: StatCardProps) {
    const colors = accentColors[accent];
    return (
        <div className={`bg-[#0d1210] border border-[#1a2a1a] border-t-2 ${colors.border} rounded-sm p-5 relative group hover:-translate-y-0.5 transition-transform duration-200`}>
            <div className="text-[9px] font-mono tracking-[0.25em] text-[#3a5a3a] uppercase mb-3">
                {label}
            </div>
            <div className={`text-3xl font-black tracking-tight ${colors.val} leading-none mb-1`}>
                {value === "—" || value === 0 ? <span className="text-[#2a3a2a]">—</span> : value}
            </div>
            {sub && (
                <div className="text-[11px] text-[#3a4a3a] font-mono mt-1">{sub}</div>
            )}
            {delta && (
                <div className={`absolute top-4 right-4 text-[9px] font-mono tracking-wider px-2 py-1 rounded-sm border ${
                    deltaUp
                        ? "text-[#4aff8c] bg-[#4aff8c]/5 border-[#4aff8c]/20"
                        : "text-red-400 bg-red-500/5 border-red-500/20"
                }`}>
                    {deltaUp ? "+" : ""}{delta}
                </div>
            )}
        </div>
    );
}