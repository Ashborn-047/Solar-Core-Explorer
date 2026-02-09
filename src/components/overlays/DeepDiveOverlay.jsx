import React, { useState, useRef } from 'react';
import { Crosshair, Wind, Map, ArrowLeft, Activity, Layers, Zap, Magnet, BookOpen, Microscope, Radio, ChevronDown, Rocket, ExternalLink } from 'lucide-react';
import { PLANET_INFO, MISSION_DATA } from '../../data';

export default function DeepDiveOverlay({
    planetName,
    onClose,
    onOpenMissions,
    activeModule,
    setActiveModule,
    activeLandmark,
    setActiveLandmark,
    isStructuralView,
    setIsStructuralView,
    isHeatmapView,
    setIsHeatmapView,
    isGravityView,
    setIsGravityView,
    isRoverView,
    setIsRoverView
}) {
    const [showLandmarks, setShowLandmarks] = useState(false);
    const scrollContainerRef = useRef(null);
    const sectionRefs = {
        'Dossier': useRef(null),
        'Atmosphere': useRef(null),
        'Geography': useRef(null),
        'Habitability': useRef(null),
        'Mechanics': useRef(null),
        'Moons': useRef(null),
        'Missions': useRef(null)
    };

    // Defensive data access
    const info = PLANET_INFO?.[planetName] || {};
    if (!planetName || Object.keys(info).length === 0) {
        return (
            <div className="absolute inset-0 z-[10005] flex items-center justify-center bg-black/90">
                <div className="text-white text-center p-4">
                    <p className="text-lg sm:text-xl mb-4">No data available for {planetName || 'unknown body'}</p>
                    <button onClick={onClose} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Close</button>
                </div>
            </div>
        );
    }

    // Safe data access with defaults
    const description = info.description || '';
    const history = info.history || '';
    const significance = info.significance || '';
    const composition = info.composition || null;
    const mechanics = info.mechanics || null;
    const landmarks = Array.isArray(info.landmarks) ? info.landmarks : [];
    const moons = Array.isArray(info.moons) ? info.moons : [];

    // Filter missions targeting this planet/body
    const planetMissions = (MISSION_DATA || []).filter(m => {
        if (!m || !m.target) return false;
        const target = m.target.toLowerCase();
        const planet = (planetName || '').toLowerCase();
        return target === planet ||
            target.includes(planet) ||
            (planetName === 'Luna' && m.target === 'Moon');
    });

    const allModules = [
        { id: 'Dossier', icon: BookOpen, label: 'Dossier', exists: !!description },
        { id: 'Atmosphere', icon: Microscope, label: 'Atmosphere', exists: !!composition },
        { id: 'Geography', icon: Map, label: 'Chronicle', exists: !!history || landmarks.length > 0 },
        { id: 'Habitability', icon: Wind, label: 'Habitability', exists: !!info.habitability || !!significance },
        { id: 'Mechanics', icon: Magnet, label: 'Orbital', exists: !!mechanics },
        { id: 'Moons', icon: Activity, label: 'Satellites', exists: moons.length > 0 || planetName === 'Jupiter' || planetName === 'Saturn' },
        { id: 'Missions', icon: Rocket, label: 'Missions', exists: planetMissions.length > 0 },
    ];

    const modules = allModules.filter(m => m.exists);

    const scrollToSection = (id) => {
        setActiveModule(id);
        const section = sectionRefs[id]?.current;
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="absolute inset-0 z-[10005] flex flex-col pointer-events-none animate-in fade-in duration-700 bg-[#050508]/40 backdrop-blur-[2px]">
            {/* RESPONSIVE HEADER */}
            <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 flex justify-between items-center pointer-events-auto bg-gradient-to-b from-black/70 to-transparent border-b border-white/5">
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-black italic tracking-tight text-white uppercase leading-none">{planetName}</h2>
                    <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                        <Radio size={8} className="text-cyan-500 animate-pulse sm:w-2.5 sm:h-2.5" />
                        <span className="text-[7px] sm:text-[9px] font-bold tracking-widest text-cyan-400 uppercase">LIVE</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                    {/* LINK SENSORS - Hidden on mobile, icons only on tablet */}
                    <div className="hidden md:flex items-center gap-1 sm:gap-2 mr-1 sm:mr-2 bg-white/5 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setIsStructuralView && setIsStructuralView(!isStructuralView)}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${isStructuralView ? 'bg-orange-500/20 text-orange-400' : 'text-white/40 hover:text-white/70'}`}
                        >
                            <Layers size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="hidden lg:inline">Structure</span>
                        </button>
                        <button
                            onClick={() => setIsHeatmapView && setIsHeatmapView(!isHeatmapView)}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${isHeatmapView ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white/70'}`}
                        >
                            <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="hidden lg:inline">Thermal</span>
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all font-bold uppercase tracking-widest text-[8px] sm:text-[9px] rounded-lg border border-white/10"
                    >
                        <span className="hidden sm:inline">Exit</span>
                        <ArrowLeft size={10} className="rotate-180 sm:w-3 sm:h-3" />
                    </button>
                </div>
            </div>

            {/* FULL WIDTH CONTENT AREA */}
            <div className="flex-1 relative flex overflow-hidden pointer-events-auto">
                <div className="w-full h-full flex flex-col overflow-hidden px-3 sm:px-6 lg:px-8 xl:px-12">
                    {/* HORIZONTAL COMMAND BAR - Scrollable on mobile */}
                    <div className="flex-none py-2 sm:py-3 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
                        {modules.map(mod => (
                            <button
                                key={mod.id}
                                onClick={() => scrollToSection(mod.id)}
                                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-[8px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${activeModule === mod.id ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'}`}
                            >
                                <mod.icon size={10} className="sm:w-3 sm:h-3" />
                                <span className="hidden xs:inline sm:inline">{mod.label}</span>
                            </button>
                        ))}

                        {/* LANDMARKS DROPDOWN */}
                        {landmarks.length > 0 && (
                            <div className="relative ml-auto">
                                <button
                                    onClick={() => setShowLandmarks(!showLandmarks)}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-wider transition-all ${showLandmarks ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/70'}`}
                                >
                                    <Crosshair size={10} className="sm:w-3 sm:h-3" />
                                    <span className="hidden sm:inline">Landmarks</span> ({landmarks.length})
                                    <ChevronDown size={8} className={`transition-transform sm:w-2.5 sm:h-2.5 ${showLandmarks ? 'rotate-180' : ''}`} />
                                </button>
                                {showLandmarks && (
                                    <div className="absolute top-full right-0 mt-2 w-64 sm:w-72 bg-black/98 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[10010] max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar">
                                        <div className="p-2 border-b border-white/10 bg-white/5">
                                            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-white/40">Surface Points of Interest</span>
                                        </div>
                                        {landmarks.map(landmark => (
                                            <button
                                                key={landmark?.name || Math.random()}
                                                onClick={() => setActiveLandmark && setActiveLandmark(landmark?.name === activeLandmark ? null : landmark?.name)}
                                                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 border-b border-white/5 last:border-0 transition-all ${activeLandmark === landmark?.name ? 'bg-cyan-500/15 text-cyan-300' : 'text-white/60 hover:bg-white/5 hover:text-white/90'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Crosshair size={8} className={`sm:w-2.5 sm:h-2.5 ${activeLandmark === landmark?.name ? 'text-cyan-400' : 'text-white/30'}`} />
                                                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide">{landmark?.name || 'Unknown'}</span>
                                                </div>
                                                {activeLandmark === landmark?.name && landmark?.description && (
                                                    <p className="text-[9px] sm:text-[10px] opacity-80 mt-2 leading-relaxed pl-4 border-l border-cyan-500/30">{landmark.description}</p>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SCROLLABLE CONTENT */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto custom-scrollbar"
                    >
                        <div className="space-y-6 sm:space-y-8 lg:space-y-10 py-3 sm:py-4 pb-12 sm:pb-16 max-w-6xl">
                            {/* Scientific Dossier */}
                            {description && (
                                <section ref={sectionRefs['Dossier']} className="animate-in fade-in duration-500">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-4 sm:w-6 h-[2px] bg-cyan-500" />
                                        <BookOpen size={12} className="text-cyan-400 sm:w-3.5 sm:h-3.5" />
                                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-cyan-400">Scientific Dossier</h4>
                                    </div>
                                    <div className="text-xs sm:text-sm leading-relaxed text-white/85 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-white/5">
                                        {description}
                                    </div>
                                </section>
                            )}

                            {/* Atmospheric Scan */}
                            {composition && Object.keys(composition).length > 0 && (
                                <section ref={sectionRefs['Atmosphere']} className="animate-in fade-in duration-500 delay-75">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-4 sm:w-6 h-[2px] bg-indigo-500" />
                                        <Microscope size={12} className="text-indigo-400 sm:w-3.5 sm:h-3.5" />
                                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-400">Atmospheric Composition</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-white/5">
                                        {Object.entries(composition).map(([key, value]) => (
                                            <div key={key} className="flex flex-col gap-0.5 sm:gap-1 border-l-2 border-indigo-500/40 pl-2 sm:pl-3 py-1">
                                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-indigo-300/60">{key}</span>
                                                <span className="text-sm sm:text-base font-bold text-white">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Geography / History */}
                            {history && (
                                <section ref={sectionRefs['Geography']} className="animate-in fade-in duration-500 delay-100">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-4 sm:w-6 h-[2px] bg-yellow-500" />
                                        <Map size={12} className="text-yellow-500 sm:w-3.5 sm:h-3.5" />
                                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-yellow-500">Epochal Chronicle</h4>
                                    </div>
                                    <div className="text-xs sm:text-sm leading-relaxed text-white/80 italic pl-3 sm:pl-4 lg:pl-5 border-l-2 border-yellow-500/40 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-r-lg sm:rounded-r-xl">
                                        {history}
                                    </div>
                                </section>
                            )}

                            {/* Habitability */}
                            {significance && (
                                <section ref={sectionRefs['Habitability']} className="animate-in fade-in duration-500 delay-150">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-4 sm:w-6 h-[2px] bg-pink-500" />
                                        <Wind size={12} className="text-pink-500 sm:w-3.5 sm:h-3.5" />
                                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-pink-500">Habitability Index</h4>
                                    </div>
                                    <div className="text-xs sm:text-sm leading-relaxed text-white/80 italic pl-3 sm:pl-4 lg:pl-5 border-l-2 border-pink-500/40 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-r-lg sm:rounded-r-xl">
                                        {significance}
                                    </div>
                                </section>
                            )}

                            {/* Orbital Dynamics */}
                            {mechanics && Object.keys(mechanics).length > 0 && (
                                <section ref={sectionRefs['Mechanics']} className="animate-in fade-in duration-500 delay-200">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-4 sm:w-6 h-[2px] bg-orange-500" />
                                        <Magnet size={12} className="text-orange-400 sm:w-3.5 sm:h-3.5" />
                                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-400">Orbital Dynamics</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-white/5">
                                        {Object.entries(mechanics).map(([key, value]) => (
                                            <div key={key} className="flex flex-col gap-0.5 sm:gap-1 p-2 sm:p-3 bg-white/5 rounded-lg">
                                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-orange-300/60">{key}</span>
                                                <span className="text-sm sm:text-base lg:text-lg font-bold text-white">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Satellite Registry */}
                            {moons.length > 0 && (
                                <section ref={sectionRefs['Moons']} className="animate-in fade-in duration-500 delay-300">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="w-4 sm:w-6 h-[2px] bg-green-500" />
                                        <Activity size={12} className="text-green-500 sm:w-3.5 sm:h-3.5" />
                                        <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-green-500">Satellite Registry</h4>
                                    </div>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-white/5">
                                        {moons.map((moon, idx) => (
                                            <div key={moon || idx} className="py-1.5 sm:py-2 px-2 sm:px-3 bg-white/5 rounded-lg text-white/80 font-bold uppercase tracking-wider text-[8px] sm:text-[10px] text-center hover:bg-green-500/20 hover:text-green-300 transition-all cursor-pointer">
                                                {moon || 'Unknown'}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* MISSIONS SECTION - TEASER CARDS */}
                            {planetMissions.length > 0 && (
                                <section ref={sectionRefs['Missions']} className="animate-in fade-in duration-500 delay-400">
                                    <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-4 sm:w-6 h-[2px] bg-red-500" />
                                            <Rocket size={12} className="text-red-400 sm:w-3.5 sm:h-3.5" />
                                            <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-400">Human Missions</h4>
                                        </div>
                                        {onOpenMissions && (
                                            <button
                                                onClick={onOpenMissions}
                                                className="text-[9px] text-red-400/60 hover:text-red-400 flex items-center gap-1 uppercase tracking-wider transition-all"
                                            >
                                                View All <ExternalLink size={10} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 bg-black/40 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border border-white/5">
                                        {planetMissions.slice(0, 8).map((mission, idx) => (
                                            <div
                                                key={mission?.name || idx}
                                                className="p-2 sm:p-3 bg-white/5 rounded-lg border border-white/5 hover:border-red-500/30 transition-all cursor-pointer group"
                                                onClick={onOpenMissions}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${mission?.status === 'Active' ? 'bg-green-500/20 text-green-400' : mission?.status === 'Success' ? 'bg-cyan-500/20 text-cyan-400' : mission?.status === 'Historic' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white/50'}`}>
                                                        {mission?.status || 'Unknown'}
                                                    </span>
                                                </div>
                                                <h5 className="text-[10px] sm:text-xs font-bold text-white group-hover:text-red-300 transition-all truncate">{mission?.name || 'Unknown'}</h5>
                                                <div className="flex items-center gap-2 mt-1 text-[8px] text-white/40">
                                                    <span className="font-bold" style={{ color: mission?.color }}>{mission?.agency}</span>
                                                    <span>•</span>
                                                    <span>{mission?.launch}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {planetMissions.length > 8 && onOpenMissions && (
                                        <button
                                            onClick={onOpenMissions}
                                            className="mt-3 w-full py-2 text-[9px] font-bold uppercase tracking-widest text-red-400/60 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            View {planetMissions.length - 8} more missions <ExternalLink size={10} />
                                        </button>
                                    )}
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MINIMAL FOOTER - Hidden on very small screens */}
            <div className="hidden sm:flex px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2 justify-between items-center pointer-events-auto bg-gradient-to-t from-black/70 to-transparent border-t border-white/5">
                <div className="flex items-center gap-2 text-[7px] sm:text-[8px] font-bold tracking-widest text-white/30 uppercase">
                    <Radio size={6} className="text-green-500 animate-pulse sm:w-2 sm:h-2" />
                    Intel Stream Active
                </div>
                <div className="text-[7px] sm:text-[8px] font-bold tracking-widest text-white/20 uppercase">
                    Quantum Archive // Astrometric System
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                @media (min-width: 640px) {
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
