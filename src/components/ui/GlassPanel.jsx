import React from 'react';

export default function GlassPanel({ children, className = "", title = "" }) {
    return (
        <div className={`bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] ${className}`}>
            {title && (
                <div className="px-4 py-2 border-b border-cyan-500/10 bg-cyan-500/5 flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-[0.3em] text-cyan-500 uppercase">{title}</span>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/20" />
                    </div>
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </div>
    );
}
