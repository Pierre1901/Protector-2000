"use client";

import { useEffect, useRef } from "react";

export default function DragonEye({ size = 60 }: { size?: number }) {
    const irisRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!irisRef.current) return;
            const rect = irisRef.current.parentElement!.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const max = 5;
            const mx = (dx / Math.max(dist, 1)) * Math.min(dist * 0.1, max);
            const my = (dy / Math.max(dist, 1)) * Math.min(dist * 0.1, max);
            irisRef.current.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px))`;
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const h = size;
    const w = size * 1.6;

    return (
        <div
            className="relative flex-shrink-0"
            style={{ width: w, height: h }}
        >
            {/* Outer glow */}
            <div
                className="absolute inset-0 rounded-full blur-md opacity-30"
                style={{
                    background: "radial-gradient(ellipse, #4aff8c 0%, transparent 70%)",
                    borderRadius: "50%",
                }}
            />

            {/* Eye shape */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    borderRadius: "50%",
                    background: "radial-gradient(ellipse at 40% 35%, #0a1a0a, #020402)",
                    border: "1px solid rgba(74,255,140,0.25)",
                    boxShadow: "0 0 20px rgba(74,255,140,0.1), inset 0 0 20px rgba(0,0,0,0.8)",
                    animation: "blink 9s ease-in-out infinite",
                }}
            >
                {/* Iris */}
                <div
                    ref={irisRef}
                    className="absolute top-1/2 left-1/2"
                    style={{
                        transform: "translate(-50%, -50%)",
                        width: h * 0.65,
                        height: h * 0.65,
                        borderRadius: "50%",
                        background: "radial-gradient(ellipse at 40% 35%, #1aff6a 0%, #0a8a3a 35%, #022a12 70%)",
                        boxShadow: "0 0 12px rgba(74,255,140,0.4)",
                        transition: "transform 0.08s ease-out",
                    }}
                >
                    {/* Pupil */}
                    <div
                        className="absolute top-1/2 left-1/2"
                        style={{
                            transform: "translate(-50%, -50%)",
                            width: h * 0.1,
                            height: h * 0.55,
                            background: "#010801",
                            borderRadius: "50%",
                            boxShadow: "0 0 6px rgba(0,0,0,0.9)",
                            animation: "pupilDilate 7s ease-in-out infinite",
                        }}
                    />
                    {/* Highlight */}
                    <div
                        className="absolute"
                        style={{
                            top: "18%", left: "22%",
                            width: h * 0.12, height: h * 0.08,
                            background: "rgba(200,255,220,0.4)",
                            borderRadius: "50%",
                            transform: "rotate(-20deg)",
                            filter: "blur(1px)",
                        }}
                    />
                </div>

                {/* Eyelid top */}
                <div
                    className="absolute top-0 left-0 right-0"
                    style={{
                        height: "30%",
                        background: "linear-gradient(to bottom, #0a0d0f, rgba(10,13,15,0.5))",
                        borderRadius: "50% 50% 0 0 / 80% 80% 0 0",
                        zIndex: 2,
                    }}
                />
                {/* Eyelid bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{
                        height: "22%",
                        background: "linear-gradient(to top, #0a0d0f, rgba(10,13,15,0.5))",
                        borderRadius: "0 0 50% 50% / 0 0 80% 80%",
                        zIndex: 2,
                    }}
                />
            </div>

            <style>{`
        @keyframes blink {
          0%, 88%, 100% { transform: scaleY(1); }
          93% { transform: scaleY(0.06); }
        }
        @keyframes pupilDilate {
          0%, 100% { width: ${h * 0.1}px; height: ${h * 0.55}px; }
          50% { width: ${h * 0.07}px; height: ${h * 0.62}px; }
        }
      `}</style>
        </div>
    );
}