export type StreamInfo = {
    live: boolean;
    title?: string;
    game?: string;
    viewers?: number;
    duration?: string;
};

export default function LiveBanner({ stream }: { stream: StreamInfo }) {
    return (
        <div className={`border rounded-sm p-5 flex items-center gap-5 transition-colors duration-300 ${
            stream.live
                ? "bg-[#4aff8c]/3 border-[#4aff8c]/20"
                : "bg-white/[0.02] border-[#1a2a1a]"
        }`}>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    {stream.live ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              EN DIRECT
            </span>
                    ) : (
                        <span className="text-[9px] font-mono tracking-[0.2em] text-[#3a5a3a] bg-white/[0.02] border border-[#1a2a1a] px-2 py-1 rounded-sm">
              HORS LIGNE
            </span>
                    )}
                    {stream.duration && (
                        <span className="text-[10px] font-mono text-[#3a5a3a]">{stream.duration}</span>
                    )}
                </div>
                <div className="text-white font-bold truncate">
                    {stream.title || "En attente du prochain stream..."}
                </div>
                {stream.game && (
                    <div className="text-[12px] text-[#3a5a3a] font-mono mt-1">🎮 {stream.game}</div>
                )}
            </div>

            <div className="text-right flex-shrink-0">
                <div className={`text-3xl font-black leading-none ${stream.live ? "text-[#4aff8c]" : "text-[#2a3a2a]"}`}>
                    {stream.viewers ?? 0}
                </div>
                <div className="text-[9px] font-mono tracking-widest text-[#3a5a3a] mt-0.5">VIEWERS</div>
            </div>
        </div>
    );
}