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
                    // DETAIL VIEW
                    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
                        <button
                            onClick={() => setSelectedMission(null)}
                            className="mb-6 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-all"
                        >
                            <ArrowLeft size={14} /> Back to Gallery
                        </button>

                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            {/* Mission Image Placeholder */}
                            <div
                                className="h-48 sm:h-64 lg:h-80 relative flex items-center justify-center"
                                style={{ backgroundColor: selectedMission.color + '20' }}
                            >
                                <Rocket size={80} style={{ color: selectedMission.color }} className="opacity-30" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050508] to-transparent" />
                                <div className="absolute bottom-4 left-6 right-6">
                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${STATUS_STYLES[selectedMission.status] || 'bg-white/10 text-white/50 border-white/10'}`}>
                                        {selectedMission.status}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">{selectedMission.name}</h2>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-white/60">
                                        <span style={{ color: AGENCY_COLORS[selectedMission.agency] || '#ffffff' }} className="font-bold">{selectedMission.agency}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {selectedMission.launch}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Target size={12} /> {selectedMission.target}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Mission Details */}
                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Mission Overview</h3>
                                    <p className="text-white/80 leading-relaxed">{selectedMission.description}</p>
                                </div>

                                {selectedMission.scientific_goal && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Scientific Objective</h3>
                                        <p className="text-white/70 leading-relaxed">{selectedMission.scientific_goal}</p>
                                    </div>
                                )}

                                {selectedMission.importance && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-2">Historical Significance</h3>
                                        <p className="text-white/70 leading-relaxed italic">{selectedMission.importance}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/10">
                                    <a
                                        href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selectedMission.name.replace(/ /g, '_'))}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white transition-all"
                                    >
                                        <ExternalLink size={14} /> Learn More on Wikipedia
                                    </a>
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
                                                {/* Mini Image Placeholder */}
                                                <div
                                                    className="h-24 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                                                    style={{ backgroundColor: mission.color + '15' }}
                                                >
                                                    <Rocket
                                                        size={32}
                                                        style={{ color: mission.color }}
                                                        className="opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300"
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
