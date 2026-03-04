import React, { useState } from 'react';
import { ChevronRight, Lock, CheckCircle, Circle, ArrowLeft, Search, Code, FileCode, Layout, Terminal, Plus, Minus, RotateCcw, Loader2, Youtube, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { supabase } from '../../lib/supabaseClient';

const Roadmap = () => {
    const { session } = useAuth();
    const { reports, isLoading: reportsLoading } = useReports();
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'detail'
    const [searchQuery, setSearchQuery] = useState('');

    const [roadmapData, setRoadmapData] = useState(null);
    const [isFetchingRoadmap, setIsFetchingRoadmap] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const [zoomLevel, setZoomLevel] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Using index as the selected step ID for the dynamic array
    const [selectedStepId, setSelectedStepId] = useState(null);

    // Derived filtered reports
    const filteredReports = reports.filter(r =>
        r.language?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    const handleResetZoom = () => {
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleNodeClick = (stepIndex) => {
        setSelectedStepId(stepIndex);
    };

    // API Call
    const handleReportClick = async (reportId) => {
        if (!session) return;

        setActiveTab('detail');
        setIsFetchingRoadmap(true);
        setFetchError(null);
        setRoadmapData(null);
        setSelectedStepId(null);
        handleResetZoom();

        try {
            const report = reports.find(r => r.id === reportId);
            const languageName = report?.language || "Python";
            console.log("Fetching roadmap for language:", languageName);

            // 1. Check if the roadmap already exists in the Database (via Context)
            let dbRoadmapExists = false;
            let rawData = null;

            // the user just clicked on the report, and the context already has it fetched (and we preserved roadmap in utils)
            const dbReport = reports.find(r => r.id === reportId);

            if (dbReport && dbReport.roadmap) {
                const mapData = dbReport.roadmap;
                // If it's a string, it means it's valid if it looks like JSON
                const strCheck = typeof mapData === 'string' ? mapData : JSON.stringify(mapData);
                if (strCheck && strCheck.length > 20 && !strCheck.includes("Invalid UUID")) {
                    dbRoadmapExists = true;
                }
            }

            if (dbRoadmapExists) {
                console.log("Roadmap already exists, loaded from Context");
                rawData = dbReport.roadmap;
            } else {
                // Secondary check: Did the Edge function save it in "road_map" table but frontend hasn't loaded it?
                console.log("Roadmap not in Context, checking road_map table directly before triggering AI...");
                const { data: remoteMap, error: mapErr } = await supabase
                    .from('road_map')
                    .select('*')
                    .eq('id', reportId)
                    .single();

                if (remoteMap && remoteMap.roadmap) {
                    console.log("Found roadmap in road_map table. Bypassing Edge Function.");
                    rawData = remoteMap.roadmap;

                    // Cache it back to context
                    if (dbReport) dbReport.roadmap = rawData;
                } else {
                    console.log("Roadmap completely missing, generating via Edge Function...");

                    // 2. Only call the generation edge function if it doesn't exist anywhere
                    const response = await fetch('https://rqqdmxvhhrxdghnhefmp.supabase.co/functions/v1/roadmap-submit', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`,
                            'apikey': 'sb_publishable_uFkTNQBEEI5_cfWrKmSseQ_76imNDzP',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code_submit_id: reportId })
                    });

                    if (!response.ok) {
                        let errText = await response.text();
                        throw new Error(`Edge Error (${response.status}): ${errText.substring(0, 100)}`);
                    }

                    try {
                        rawData = await response.json();

                        // Optimistically update the context/state reports so it doesn't fetch again next time
                        if (dbReport) {
                            dbReport.roadmap = rawData;
                        }

                        // Save back to code_submit as well for faster context fetching
                        supabase.from('code_submit')
                            .update({ roadmap: rawData })
                            .eq('id', reportId)
                            .then(({ error }) => {
                                if (error) console.error("Failed to persist new roadmap to DB:", error);
                                else console.log("Successfully persisted roadmap to DB for next visit!");
                            });

                    } catch (err) {
                        throw new Error("Failed to parse edge function JSON");
                    }
                }
            }

            if (!rawData) {
                throw new Error("No payload loaded from DB or Edge.");
            }

            // Extreme recursive search for any array that looks like the roadmap
            const extractRoadmap = (obj) => {
                if (!obj) return null;
                // If it's the exact array we want (has a topic property inside its items)
                if (Array.isArray(obj) && obj.length > 0 && obj[0] && (obj[0].topic || obj[0].step)) {
                    return obj;
                }

                // If it's a string, try parsing it
                if (typeof obj === 'string') {
                    try {
                        let cleaned = obj.replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/i, '').trim();
                        // Deep parse strings that were double or triple stringified
                        while (typeof cleaned === 'string' && (cleaned.startsWith('{') || cleaned.startsWith('['))) {
                            try {
                                cleaned = JSON.parse(cleaned);
                            } catch (e) {
                                break;
                            }
                        }

                        // Handle extreme cases where it's wrapped in multiple json tags or quotes
                        if (typeof cleaned === 'string' && cleaned.startsWith('"') && cleaned.endsWith('"')) {
                            // Unescape quotes manually if JSON.parse failed
                            cleaned = cleaned.slice(1, -1).replace(/\\"/g, '"');
                            try {
                                cleaned = JSON.parse(cleaned);
                            } catch (e) { }
                        }

                        // If it successfully became an object/array, recurse
                        if (typeof cleaned === 'object' && cleaned !== null) {
                            return extractRoadmap(cleaned);
                        }
                    } catch (e) {
                        return null; // Ignore parse failures on strings not meant to be parsed
                    }
                }

                // If it's an object, search all keys recursively
                if (typeof obj === 'object') {
                    for (const key of Object.keys(obj)) {
                        const res = extractRoadmap(obj[key]);
                        if (res) return res;
                    }
                }
                return null;
            };

            const roadmapArray = extractRoadmap(rawData);

            if (!roadmapArray || roadmapArray.length === 0) {
                // Return exactly what the obj was so we can see it on screen!
                const shape = typeof rawData === 'object' ? JSON.stringify(rawData).substring(0, 200) : String(rawData).substring(0, 200);
                throw new Error("Invalid roadmap format. Input shape: " + shape);
            }

            console.log("Successfully extracted roadmap array:", roadmapArray);
            setRoadmapData({ roadmap: roadmapArray });
            setSelectedStepId(0);
        } catch (error) {
            console.error("Error fetching roadmap:", error);
            setFetchError(error.message || "Failed to generate roadmap.");
            setRoadmapData(null);
        } finally {
            setIsFetchingRoadmap(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                        {activeTab === 'list' ? 'Road Maps' : 'Roadmap Detail View'}
                    </h2>
                    {activeTab === 'list' && <p className="text-text-secondary text-sm">Select a past report to view its guided learning path</p>}
                </div>
                {activeTab === 'detail' && (
                    <button
                        onClick={() => setActiveTab('list')}
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to list
                    </button>
                )}
            </div>

            {activeTab === 'list' ? (
                <div className="space-y-4 animate-fadeIn overflow-y-auto custom-scrollbar pr-2 pb-10">
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search your code reports"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-text-primary focus:border-accent outline-none placeholder:text-text-secondary/50 transition-all"
                        />
                    </div>

                    <div className="grid gap-4">
                        {reportsLoading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            </div>
                        ) : filteredReports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-secondary border border-border rounded-2xl text-text-secondary">
                                <BookOpen className="w-12 h-12 mb-3 opacity-50" />
                                <p>No reports found. Submit code to generate roadmaps!</p>
                            </div>
                        ) : filteredReports.map((map) => {
                            const MapIcon = map.icon || Code;
                            return (
                                <div
                                    key={map.id}
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01] bg-secondary border border-border hover:shadow-lg"
                                    onClick={() => handleReportClick(map.id)}
                                >
                                    {/* Gradient Bottom Border */}
                                    <div className={`absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r ${map.color} opacity-80`}></div>

                                    <div className="relative p-5 flex items-center justify-between z-10">
                                        <div className="flex items-center gap-4">
                                            {/* Circular Icon Badge */}
                                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${map.color} p-[2px] shadow-lg flex-shrink-0`}>
                                                <div className="w-full h-full rounded-full bg-gray-200 group-hover:bg-gray-300 dark:bg-secondary dark:group-hover:bg-secondary border border-border flex items-center justify-center transition-colors">
                                                    <MapIcon className="w-6 h-6 text-text-primary dark:text-white" />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-text-primary text-xl underline decoration-2 underline-offset-4 decoration-border group-hover:decoration-accent transition-colors">{map.title}</h3>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${map.status === 'Excellent' ? 'bg-green-500/10 border-green-500/20 text-green-400 group-hover:bg-green-500/20' : 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20'}`}>
                                                        {map.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-text-secondary mt-2">
                                                    <span>{map.language}</span>
                                                    <span>•</span>
                                                    <span>{map.date}</span>
                                                    <span>•</span>
                                                    <span>Score: {map.score}%</span>
                                                    <span>•</span>
                                                    {map.roadmap ? (
                                                        <span className="text-green-500 font-bold">Has Roadmap Data</span>
                                                    ) : (
                                                        <span className="text-red-500 font-bold">NULL Roadmap</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-secondary border border-border rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl animate-fadeIn group">
                    {/* Zoom Controls */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-[60] bg-secondary/80 backdrop-blur-sm p-1.5 rounded-xl border border-border shadow-xl">
                        <button onClick={handleZoomIn} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-primary transition-colors" title="Zoom In">
                            <Plus className="w-4 h-4" />
                        </button>
                        <button onClick={handleZoomOut} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-primary transition-colors" title="Zoom Out">
                            <Minus className="w-4 h-4" />
                        </button>
                        <button onClick={handleResetZoom} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-primary transition-colors" title="Reset">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Circuit Background Effect */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `
                                linear-gradient(90deg, rgb(var(--grid-color)) 1px, transparent 1px), 
                                linear-gradient(180deg, rgb(var(--grid-color)) 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }}>
                    </div>
                    {/* Decorative Circuit Lines */}
                    <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-white/10 rounded-tl-3xl pointer-events-none"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-white/10 rounded-br-3xl pointer-events-none"></div>

                    {/* API Loading State Overlay */}
                    {isFetchingRoadmap && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-secondary/80 backdrop-blur-sm">
                            <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                            <p className="text-text-primary font-bold text-lg animate-pulse">Generating personalized roadmap...</p>
                            <p className="text-text-secondary text-sm mt-2">Connecting to AI Mentor...</p>
                        </div>
                    )}

                    {/* Error State Overlay */}
                    {!isFetchingRoadmap && fetchError && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-secondary/80 backdrop-blur-sm">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4 border border-red-500/50">
                                <RotateCcw className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-text-primary font-bold text-lg mb-2">Roadmap Generation Failed</p>
                            <p className="text-red-400 text-sm mb-6 max-w-md text-center">{fetchError}</p>
                            <button onClick={() => setActiveTab('list')} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-text-primary">
                                Go Back to Reports
                            </button>
                        </div>
                    )}

                    {!isFetchingRoadmap && !fetchError && !roadmapData && (
                        <div className="text-text-secondary z-10 text-center">
                            <BookOpen className="w-12 h-12 mb-3 opacity-50 mx-auto" />
                            <p>No roadmap active.</p>
                        </div>
                    )}

                    {/* Timeline Content Wrapper for Zoom & Pan */}
                    {!isFetchingRoadmap && roadmapData?.roadmap && (
                        <div
                            className={`w-full h-full overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div
                                className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
                                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})` }}
                            >

                                <div className="flex flex-wrap items-center justify-center gap-0 w-[4000px]">

                                    {roadmapData.roadmap.map((step, index) => {
                                        const isSelected = selectedStepId === index;

                                        return (
                                            <React.Fragment key={index}>
                                                {/* Node */}
                                                <div className="relative flex flex-col items-center shrink-0 min-w-[120px]">
                                                    {/* Node Circle */}
                                                    <div
                                                        className={`
                                                            w-20 h-20 rounded-full border-2 flex items-center justify-center relative z-20 cursor-pointer transition-all duration-300
                                                            ${isSelected ? 'scale-110 border-accent bg-secondary shadow-[0_0_25px_rgba(100,255,218,0.5)]' :
                                                                'border-border bg-secondary text-text-secondary hover:border-accent/40 bg-secondary group'}
                                                        `}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNodeClick(index);
                                                        }}
                                                    >
                                                        <div className={`${isSelected ? 'text-accent' : 'group-hover:text-text-primary'}`}>
                                                            {isSelected ? <Terminal className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                                        </div>

                                                        {/* Ripple Effect active */}
                                                        {isSelected && (
                                                            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20"></div>
                                                        )}
                                                    </div>

                                                    {/* Label */}
                                                    <span className={`mt-3 font-semibold text-sm transition-colors max-w-[140px] text-center truncate ${isSelected ? 'text-text-primary scale-105' : 'text-text-secondary'}`}>
                                                        {step.topic}
                                                    </span>

                                                    {/* Detail Popover (Visible if selected) */}
                                                    <AnimatePresence mode="wait">
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute top-[140%] w-[320px] bg-secondary/95 backdrop-blur-xl border border-accent/30 rounded-2xl p-5 shadow-2xl z-30"
                                                                onMouseDown={(e) => e.stopPropagation()} // Prevent pan start on card
                                                            >
                                                                {/* Arrow */}
                                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary border-t border-l border-accent/30 rotate-45"></div>

                                                                <h4 className="font-bold text-text-primary mb-2 text-lg text-center leading-tight">{step.topic}</h4>
                                                                <div className="text-xs text-text-secondary mb-4 text-center border-b border-white/5 pb-3">
                                                                    Recommended Learning Resources
                                                                </div>

                                                                {/* Resources List */}
                                                                <div className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2 pb-4">
                                                                    {step.resources?.youtube?.video?.length > 0 && (
                                                                        <div className="space-y-2">
                                                                            <h5 className="flex items-center gap-1.5 text-red-400 font-semibold text-xs uppercase tracking-wider">
                                                                                <Youtube className="w-3.5 h-3.5" /> Videos
                                                                            </h5>
                                                                            {step.resources.youtube.video.map((v, i) => (
                                                                                <a key={i} href={v.url} target="_blank" rel="noreferrer" className="block p-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 transition-colors line-clamp-2 text-xs text-text-primary hover:text-accent group">
                                                                                    {v.title}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {step.resources?.youtube?.playlist?.length > 0 && (
                                                                        <div className="space-y-2 mt-4">
                                                                            <h5 className="flex items-center gap-1.5 text-red-500 font-semibold text-xs uppercase tracking-wider">
                                                                                <Youtube className="w-3.5 h-3.5" /> Playlists
                                                                            </h5>
                                                                            {step.resources.youtube.playlist.map((p, i) => (
                                                                                <a key={i} href={p.url} target="_blank" rel="noreferrer" className="block p-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 transition-colors line-clamp-2 text-xs text-text-primary hover:text-accent group">
                                                                                    {p.title}
                                                                                </a>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {step.resources?.tutorials?.length > 0 && (
                                                                        <div className="space-y-2 mt-4">
                                                                            <h5 className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs uppercase tracking-wider">
                                                                                <BookOpen className="w-3.5 h-3.5" /> Text Tutorials
                                                                            </h5>
                                                                            {step.resources.tutorials.map((t, i) => {
                                                                                let domain = 'Article';
                                                                                try {
                                                                                    domain = new URL(t).hostname.replace('www.', '');
                                                                                } catch (e) { }
                                                                                return (
                                                                                    <a key={i} href={t} target="_blank" rel="noreferrer" className="block p-2 bg-white/5 hover:bg-white/10 rounded border border-white/5 transition-colors text-xs text-blue-300 hover:text-blue-200 truncate pr-2">
                                                                                        {domain}
                                                                                    </a>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    )}

                                                                    {/* Fallback if totally empty resource list */}
                                                                    {(!step.resources?.youtube?.video?.length && !step.resources?.youtube?.playlist?.length && !step.resources?.tutorials?.length) && (
                                                                        <p className="text-gray-500 text-xs text-center italic">No external links provided for this topic.</p>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Connector (if not last item) */}
                                                {index < roadmapData.roadmap.length - 1 && (
                                                    <div className="w-24 h-[2px] bg-white/10 relative mx-2 shrink-0">
                                                        <div className={`absolute inset-0 bg-gradient-to-r from-accent to-accent/50 transition-all duration-500 ${selectedStepId === index || selectedStepId === index + 1 ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}

                                    {/* Branches (Static Decor at end) */}
                                    {roadmapData.roadmap.length > 0 && (
                                        <div className="relative flex flex-col justify-center h-40 ml-4 opacity-50 shrink-0">
                                            <div className="absolute top-0 left-0 w-16 h-20 border-b-2 border-r-2 border-white/10 rounded-br-3xl transform -translate-y-10"></div>
                                            <div className="absolute bottom-0 left-0 w-16 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-3xl transform translate-y-10"></div>
                                            <div className="absolute top-[-30px] right-[-24px] transform translate-x-full"><Lock className="w-5 h-5 text-text-secondary" /></div>
                                            <div className="absolute bottom-[-30px] right-[-24px] transform translate-x-full"><Lock className="w-5 h-5 text-text-secondary" /></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Roadmap;
