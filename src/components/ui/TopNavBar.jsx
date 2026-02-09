import React, { useState } from 'react';
import { Rocket, Volume2, VolumeX, Settings, ChevronDown, Menu, X, Orbit } from 'lucide-react';

const LENS_MODES = ['normal', 'thermal', 'xray', 'retro'];

export default function TopNavBar({
    timeScale,
    setTimeScale,
    lensMode,
    setLensMode,
    audioEnabled,
    setAudioEnabled,
    onOpenMissions,
    onOpenSettings,
    isImmersive
}) {
    const [isLensOpen, setIsLensOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isImmersive) return null;

    return (
        <>
            {/* DESKTOP TOP BAR */}
            <nav className="hidden sm:flex fixed top-0 left-0 right-0 z-[100] h-14 bg-[#050508]/90 backdrop-blur-xl border-b border-white/10 items-center justify-between px-6">
                {/* LEFT: Branding */}
                <div className="flex items-center gap-3">
                    <Orbit className="w-6 h-6 text-cyan-500" />
                    <span className="text-sm font-black tracking-[0.2em] text-white uppercase">
                        Astro<span className="text-cyan-500">metric</span>
                    </span>
                </div>

                {/* CENTER: Controls */}
                <div className="flex items-center gap-4">
                    {/* Time Scale */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Speed</span>
                        <input
                            type="range"
                            min="-10"
                            max="100"
                            step="0.5"
                            value={timeScale}
                            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                            className="w-20 accent-cyan-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-cyan-400 w-10">{timeScale.toFixed(1)}x</span>
                    </div>

                    {/* Lens Mode Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLensOpen(!isLensOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all"
                        >
                            <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Lens</span>
                            <span className="text-xs font-bold text-cyan-400 uppercase">{lensMode}</span>
                            <ChevronDown size={12} className={`text-white/40 transition-transform ${isLensOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isLensOpen && (
                            <div className="absolute top-full mt-1 left-0 bg-[#0a0a0f] border border-white/10 rounded-lg overflow-hidden shadow-2xl min-w-[120px]">
                                {LENS_MODES.map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => { setLensMode(mode); setIsLensOpen(false); }}
                                        className={`w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider transition-all ${lensMode === mode ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mission Control */}
                    <button
                        onClick={onOpenMissions}
                        className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 hover:border-red-500 transition-all"
                    >
                        <Rocket size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">Missions</span>
                    </button>
                </div>

                {/* RIGHT: Toggles */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className={`p-2 rounded-lg border transition-all ${audioEnabled ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                    >
                        {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    {onOpenSettings && (
                        <button
                            onClick={onOpenSettings}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                        >
                            <Settings size={16} />
                        </button>
                    )}
                </div>
            </nav>

            {/* MOBILE TOP BAR */}
            <nav className="sm:hidden fixed top-0 left-0 right-0 z-[100] h-12 bg-[#050508]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
                {/* Branding */}
                <div className="flex items-center gap-2">
                    <Orbit className="w-5 h-5 text-cyan-500" />
                    <span className="text-xs font-black tracking-wider text-white uppercase">
                        Astro<span className="text-cyan-500">metric</span>
                    </span>
                </div>

                {/* Hamburger */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white/60"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </nav>

            {/* MOBILE MENU DRAWER */}
            {isMobileMenuOpen && (
                <div className="sm:hidden fixed inset-0 z-[99] bg-[#050508]/98 backdrop-blur-xl pt-14 px-6 pb-6 animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col gap-4">
                        {/* Time Scale */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-white/40">Simulation Speed</span>
                                <span className="text-sm font-bold text-cyan-400">{timeScale.toFixed(1)}x</span>
                            </div>
                            <input
                                type="range"
                                min="-10"
                                max="100"
                                step="0.5"
                                value={timeScale}
                                onChange={(e) => setTimeScale(parseFloat(e.target.value))}
                                className="w-full accent-cyan-500"
                            />
                        </div>

                        {/* Lens Mode */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <span className="text-xs font-bold uppercase tracking-wider text-white/40 mb-3 block">Lens Mode</span>
                            <div className="grid grid-cols-2 gap-2">
                                {LENS_MODES.map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setLensMode(mode)}
                                        className={`py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${lensMode === mode ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/60'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={() => { onOpenMissions(); setIsMobileMenuOpen(false); }}
                            className="w-full py-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <Rocket size={16} />
                            Mission Control
                        </button>

                        <button
                            onClick={() => setAudioEnabled(!audioEnabled)}
                            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 ${audioEnabled ? 'bg-purple-500/20 border border-purple-500 text-purple-400' : 'bg-white/5 border border-white/10 text-white/60'}`}
                        >
                            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            Audio {audioEnabled ? 'On' : 'Off'}
                        </button>
                    </div>
                </div>
            )}

            {/* Spacer to prevent content from going under nav */}
            <div className="h-14 sm:h-14" />
        </>
    );
}
