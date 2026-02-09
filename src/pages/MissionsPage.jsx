import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Rocket, Filter, X, ExternalLink, Calendar, Building2, Target, Zap } from 'lucide-react';
import { MISSION_DATA } from '../data';

// Agency color mapping
const AGENCY_COLORS = {
    'NASA': '#0066cc',
    'ISRO': '#ff9933',
    'ESA': '#4488ff',
    'JAXA': '#ff6699',
    'CNSA': '#ffcc00',
    'USSR': '#cc0000',
    'UAE': '#00cc66',
    'NASA/ESA': '#9966ff',
    'NASA/ESA/CSA': '#ffcc66'
};

// Status badge styles
const STATUS_STYLES = {
    'Active': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Completed': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Success': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Historic': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
};

// Get unique values from missions
const getUniqueValues = (key) => [...new Set(MISSION_DATA.map(m => m[key]))].filter(Boolean).sort();

// Mission Image Component with skeleton loading
function MissionImage({ src, alt, color, size = 'sm', className = '' }) {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const sizeClasses = {
        sm: 'h-24',
        lg: 'h-48 sm:h-64 lg:h-80'
    };

    const iconSize = size === 'lg' ? 64 : 28;

    return (
        <div
            className={`${sizeClasses[size]} rounded-lg flex items-center justify-center relative overflow-hidden ${className}`}
            style={{
                background: `linear-gradient(135deg, ${color}30 0%, ${color}10 50%, transparent 100%)`
            }}
        >
            {/* Animated background pattern for empty state */}
            {(!src || hasError) && (
                <>
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `radial-gradient(circle at 20% 80%, ${color}40 0%, transparent 50%), 
                                            radial-gradient(circle at 80% 20%, ${color}30 0%, transparent 40%)`
                        }}
                    />
                    <div className="absolute top-2 right-2 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                    <div className="absolute bottom-4 left-4 w-0.5 h-8 rounded-full opacity-30" style={{ backgroundColor: color }} />
                </>
            )}

            {/* Skeleton loader */}
            {!isLoaded && !hasError && src && (
                <div className="absolute inset-0 skeleton" />
            )}

            {/* Actual image */}
            {src && !hasError && (
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                />
            )}

            {/* Fallback icon with glow */}
            {(!src || hasError) && (
                <div className="flex flex-col items-center gap-2">
                    <Rocket
                        size={iconSize}
                        style={{ color, filter: `drop-shadow(0 0 10px ${color}50)` }}
                        className="opacity-60 animate-pulse"
                    />
                    {size === 'lg' && (
                        <span className="text-[9px] uppercase tracking-widest opacity-40" style={{ color }}>
                            Mission Visual
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MissionsPage({ onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgency, setSelectedAgency] = useState('All');
    const [selectedTarget, setSelectedTarget] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedMission, setSelectedMission] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const agencies = ['All', ...getUniqueValues('agency')];
    const targets = ['All', ...getUniqueValues('target')];
    const statuses = ['All', ...getUniqueValues('status')];

    // Filter missions
    const filteredMissions = useMemo(() => {
        return MISSION_DATA.filter(mission => {
            const matchesSearch = mission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mission.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesAgency = selectedAgency === 'All' || mission.agency === selectedAgency;
            const matchesTarget = selectedTarget === 'All' || mission.target === selectedTarget;
            const matchesStatus = selectedStatus === 'All' || mission.status === selectedStatus;
            return matchesSearch && matchesAgency && matchesTarget && matchesStatus;
        });
    }, [searchQuery, selectedAgency, selectedTarget, selectedStatus]);

    // Group missions by target category
    const groupedMissions = useMemo(() => {
        const groups = {};
        filteredMissions.forEach(mission => {
            const target = mission.target || 'Other';
            if (!groups[target]) groups[target] = [];
            groups[target].push(mission);
        });
        return groups;
    }, [filteredMissions]);

    const activeFiltersCount = [selectedAgency, selectedTarget, selectedStatus].filter(f => f !== 'All').length;

    return (
        <div className="fixed inset-0 z-[10010] bg-[#050508] flex flex-col overflow-hidden">
            {/* HEADER */}
            <header className="flex-none px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/50 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                                <Rocket className="text-red-400" size={24} />
                                Mission Control
                            </h1>
                            <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mt-0.5">
                                {MISSION_DATA.length} Missions • Humanity's Journey Through Space
                            </p>
                        </div>
                    </div>

                    {/* SEARCH & FILTER */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                placeholder="Search missions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-40 sm:w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`relative p-2.5 rounded-lg border transition-all ${showFilters ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                        >
                            <Filter size={16} />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* FILTER BAR */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                            <Building2 size={12} className="text-white/40" />
                            <select
                                value={selectedAgency}
                                onChange={(e) => setSelectedAgency(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                            >
                                {agencies.map(a => <option key={a} value={a} className="bg-[#0a0a0f]">{a}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={12} className="text-white/40" />
                            <select
                                value={selectedTarget}
                                onChange={(e) => setSelectedTarget(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                            >
                                {targets.map(t => <option key={t} value={t} className="bg-[#0a0a0f]">{t}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={12} className="text-white/40" />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                            >
                                {statuses.map(s => <option key={s} value={s} className="bg-[#0a0a0f]">{s}</option>)}
                            </select>
                        </div>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={() => { setSelectedAgency('All'); setSelectedTarget('All'); setSelectedStatus('All'); }}
                                className="ml-auto text-[10px] text-white/40 hover:text-white flex items-center gap-1 uppercase tracking-wider"
                            >
                                <X size={10} /> Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
                {selectedMission ? (
                    // DETAIL VIEW - Expanded
                    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                        <button
                            onClick={() => setSelectedMission(null)}
                            className="mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-all"
                        >
                            <ArrowLeft size={14} /> Back to Gallery
                        </button>

                        {/* Hero Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
                            <div className="relative">
                                <MissionImage
                                    src={selectedMission.image}
                                    alt={selectedMission.name}
                                    color={selectedMission.color}
                                    size="lg"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${STATUS_STYLES[selectedMission.status] || 'bg-white/10 text-white/50 border-white/10'}`}>
                                        {selectedMission.status}
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-2">{selectedMission.name}</h2>
                                    <p className="text-white/60 mt-2 max-w-2xl">{selectedMission.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <Building2 size={20} className="mx-auto mb-2" style={{ color: AGENCY_COLORS[selectedMission.agency] }} />
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Agency</p>
                                <p className="font-bold" style={{ color: AGENCY_COLORS[selectedMission.agency] }}>{selectedMission.agency}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <Calendar size={20} className="mx-auto mb-2 text-cyan-400" />
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Launch Year</p>
                                <p className="font-bold text-cyan-400">{selectedMission.launch}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <Target size={20} className="mx-auto mb-2 text-orange-400" />
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Destination</p>
                                <p className="font-bold text-orange-400">{selectedMission.target}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <Zap size={20} className="mx-auto mb-2 text-yellow-400" />
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Status</p>
                                <p className="font-bold text-yellow-400">{selectedMission.status}</p>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Main Content Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Why This Mission - Motivation */}
                                {selectedMission.motivation && (
                                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                                            🎯 Why This Mission?
                                        </h3>
                                        <p className="text-white/80 leading-relaxed">{selectedMission.motivation}</p>
                                    </div>
                                )}

                                {/* Historical Context */}
                                {selectedMission.context && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
                                            📜 Historical Background
                                        </h3>
                                        <p className="text-white/70 leading-relaxed">{selectedMission.context}</p>
                                    </div>
                                )}

                                {/* Mission Objectives */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                                        <Target size={16} /> Mission Objectives
                                    </h3>
                                    {selectedMission.scientific_goal && (
                                        <div className="mb-4">
                                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Primary Objective</p>
                                            <p className="text-white/80 leading-relaxed">{selectedMission.scientific_goal}</p>
                                        </div>
                                    )}
                                    {selectedMission.importance && (
                                        <div className="border-l-2 border-yellow-500/50 pl-4 py-2 bg-yellow-500/5 rounded-r-lg">
                                            <p className="text-[10px] uppercase tracking-wider text-yellow-400 mb-1">Historical Significance</p>
                                            <p className="text-white/70 leading-relaxed italic">{selectedMission.importance}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Mission Outcome */}
                                {selectedMission.outcome && (
                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-4 flex items-center gap-2">
                                            ✅ What Happened
                                        </h3>
                                        <p className="text-white/80 leading-relaxed">{selectedMission.outcome}</p>
                                    </div>
                                )}

                                {/* Legacy & Long-term Impact */}
                                {selectedMission.legacy && (
                                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                                            🌟 Lasting Impact
                                        </h3>
                                        <p className="text-white/80 leading-relaxed">{selectedMission.legacy}</p>
                                    </div>
                                )}

                                {/* Key Achievements */}
                                {selectedMission.achievements && selectedMission.achievements.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-green-400 mb-4 flex items-center gap-2">
                                            <Zap size={16} /> Key Achievements
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedMission.achievements.map((achievement, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <span className="text-green-400 text-xs font-bold">{idx + 1}</span>
                                                    </div>
                                                    <p className="text-white/80">{achievement}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Fun Facts */}
                                {selectedMission.funFacts && selectedMission.funFacts.length > 0 && (
                                    <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/5 border border-orange-500/20 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-4 flex items-center gap-2">
                                            🚀 Did You Know?
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {selectedMission.funFacts.map((fact, idx) => (
                                                <div key={idx} className="p-3 bg-black/30 rounded-lg border border-white/5">
                                                    <p className="text-white/70 text-sm">{fact}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-6">
                                {/* Mission Timeline */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                                        <Calendar size={16} /> Timeline
                                    </h3>
                                    <div className="relative pl-4 border-l-2 border-indigo-500/30 space-y-4">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#050508]" />
                                            <p className="text-[10px] uppercase tracking-wider text-indigo-400">Launch</p>
                                            <p className="font-bold text-white">{selectedMission.launch}</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#050508]" />
                                            <p className="text-[10px] uppercase tracking-wider text-cyan-400">Target Reached</p>
                                            <p className="font-bold text-white">{selectedMission.target}</p>
                                        </div>
                                        <div className="relative">
                                            <div className={`absolute -left-[21px] w-3 h-3 rounded-full border-2 border-[#050508] ${selectedMission.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-white/30'}`} />
                                            <p className="text-[10px] uppercase tracking-wider text-white/40">Current Status</p>
                                            <p className={`font-bold ${selectedMission.status === 'Active' ? 'text-green-400' : 'text-white/60'}`}>{selectedMission.status}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Instruments/Technology */}
                                {selectedMission.instruments && selectedMission.instruments.length > 0 && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                                            <Zap size={16} /> Onboard Tech
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedMission.instruments.map((instrument, idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                    <span className="text-xs text-purple-200">{instrument}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Facts Card */}
                                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">Quick Reference</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Agency</span>
                                            <span className="font-bold" style={{ color: AGENCY_COLORS[selectedMission.agency] }}>{selectedMission.agency}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Launch</span>
                                            <span className="font-bold text-white">{selectedMission.launch}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Target</span>
                                            <span className="font-bold text-white">{selectedMission.target}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Status</span>
                                            <span className={`font-bold ${selectedMission.status === 'Active' ? 'text-green-400' : selectedMission.status === 'Historic' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                                                {selectedMission.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // GALLERY VIEW
                    <div className="space-y-8">
                        {Object.keys(groupedMissions).length === 0 ? (
                            <div className="text-center py-20 text-white/40">
                                <Rocket size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="text-lg">No missions found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                        ) : (
                            Object.entries(groupedMissions).map(([target, missions]) => (
                                <section key={target}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-500 to-transparent" />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">{target}</h3>
                                        <span className="text-[10px] text-white/30">({missions.length})</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {missions.map(mission => (
                                            <button
                                                key={mission.name}
                                                onClick={() => setSelectedMission(mission)}
                                                className="group text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl transition-all duration-300"
                                            >
                                                {/* Mission Image Thumbnail with skeleton */}
                                                <div className="mb-3 group-hover:scale-[1.02] transition-transform duration-300">
                                                    <MissionImage
                                                        src={mission.image}
                                                        alt={mission.name}
                                                        color={mission.color}
                                                        size="sm"
                                                    />
                                                </div>

                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-all">
                                                            {mission.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                                                            <span style={{ color: AGENCY_COLORS[mission.agency] || '#888' }} className="font-bold">
                                                                {mission.agency}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{mission.launch}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`flex-none px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded border ${STATUS_STYLES[mission.status] || 'bg-white/10 text-white/50 border-white/10'}`}>
                                                        {mission.status}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* FOOTER */}
            <footer className="flex-none px-4 sm:px-6 lg:px-8 py-2 border-t border-white/5 bg-black/40">
                <div className="flex items-center justify-between text-[9px] text-white/30 uppercase tracking-widest">
                    <span>Showing {filteredMissions.length} of {MISSION_DATA.length} missions</span>
                    <span>Solar System Explorer // Mission Archive</span>
                </div>
            </footer>
        </div>
    );
}
