import React, { useState } from 'react';
import { ChevronRight, Lock, CheckCircle, Circle, ArrowLeft, Search, Code, FileCode, Layout, Terminal, Plus, Minus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Roadmap = () => {
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'detail'

    // Data for the main list of roadmaps
    const roadmaps = [
        { id: 1, title: 'C++', status: 'Excellent', date: 'Jan 28, 2025', color: 'from-blue-500 to-cyan-500', progress: 85, icon: Code },
        { id: 2, title: 'Python', status: 'Good', date: 'Jan 20, 2025', color: 'from-green-500 to-emerald-500', progress: 60, icon: Terminal },
        { id: 3, title: 'C#', status: 'Excellent', date: 'Jan 15, 2025', color: 'from-purple-500 to-pink-500', progress: 90, icon: FileCode },
        { id: 4, title: 'JavaScript', status: 'Excellent', date: 'Jan 12, 2025', color: 'from-orange-500 to-yellow-500', progress: 40, icon: Layout },
    ];

    // Data for the Front End Timeline (Detail View)
    const timelineSteps = [
        {
            id: 'html',
            label: 'HTML',
            status: 'completed',
            icon: Layout,
            details: {
                title: 'HTML5 & Semantics',
                description: 'The standard markup language for documents designed to be displayed in a web browser.',
                points: ['Semantic HTML5 Elements', 'Forms & Validations', 'Accessibility Best Practices', 'SEO Fundamentals']
            }
        },
        {
            id: 'css',
            label: 'CSS',
            status: 'completed',
            icon: FileCode,
            details: {
                title: 'CSS3 & Styling',
                description: 'Style sheet language used for describing the presentation of a document written in HTML.',
                points: ['Flexbox & Grid Layouts', 'Responsive Design (Media Queries)', 'CSS Variables & Themes', 'Transitions & Animations']
            }
        },
        {
            id: 'js',
            label: 'JavaScript',
            status: 'completed',
            icon: Terminal,
            details: {
                title: 'Modern JavaScript',
                description: 'A lightweight, interpreted, or just-in-time compiled programming language with first-class functions.',
                points: ['ES6+ Syntax (Arrow fns, Destructuring)', 'DOM Manipulation & Events', 'Async/Await & Promises', 'Local Storage & APIs']
            }
        },
        {
            id: 'react',
            label: 'React',
            status: 'active',
            icon: Code,
            details: {
                title: 'React Hooks & State',
                description: 'React is a JavaScript library for building user interfaces. It helps you create reusable components.',
                points: ['Interactive UI components', 'Manage UI state efficiently', 'Dynamic pages without reload', 'Custom Hooks & Context API']
            }
        }
    ];

    const [zoomLevel, setZoomLevel] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [selectedStepId, setSelectedStepId] = useState('react');

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

    // Helper to prevent click when dragging
    const handleNodeClick = (stepId) => {
        // If we want to prevent click on drag, we can track movement distance.
        // For simplicity, we'll allow clicks for now unless it feels clunky. 
        // A simple check: if isDragging is true (it becomes false on mouseUp), but the click event happens after.
        // We'll rely on the user intent. If they dragged, they likely won't click perfectly on a node release.
        setSelectedStepId(stepId);
    };

    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">
                        {activeTab === 'list' ? 'Road Maps' : 'Roadmap'}
                    </h2>
                    {activeTab === 'list' && <p className="text-text-secondary text-sm">Select a path to continue learning</p>}
                </div>
                {activeTab === 'detail' && (
                    <button
                        onClick={() => setActiveTab('list')}
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to list
                    </button>
                )}
            </div>

            {activeTab === 'list' ? (
                <div className="space-y-4 animate-fadeIn">
                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="search your roadmaps"
                            className="w-full bg-secondary border border-border rounded-xl py-4 pl-12 pr-4 text-text-primary focus:border-accent outline-none placeholder:text-text-secondary/50 transition-all"
                        />
                    </div>

                    <div className="grid gap-4">
                        {roadmaps.map((map) => (
                            <div
                                key={map.id}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.01] bg-secondary border border-border hover:brightness-110"
                                onClick={() => setActiveTab('detail')}
                            >
                                {/* Gradient Bottom Border */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${map.color}`}></div>

                                <div className="relative p-5 flex items-center justify-between z-10">
                                    <div className="flex items-center gap-4">
                                        {/* Circular Icon Badge */}
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${map.color} p-[2px] shadow-lg flex-shrink-0`}>
                                            <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                                                <map.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-text-primary text-xl">{map.title}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${map.status === 'Excellent' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                    {map.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                <span>Algorithm Implementation Review</span>
                                                <span>•</span>
                                                <span>{map.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-secondary border border-border rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl animate-fadeIn group">
                    {/* Zoom Controls */}
                    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-50 bg-secondary/80 backdrop-blur-sm p-1.5 rounded-xl border border-border shadow-xl">
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

                    {/* Circuit Background Effect (Moves with zoom slightly for parallax or stays static?) Let's keep it static for context */}
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

                    {/* Timeline Content Wrapper for Zoom & Pan */}
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

                            <div className="flex items-center justify-center gap-0">

                                {timelineSteps.map((step, index) => (
                                    <React.Fragment key={step.id}>
                                        {/* Node */}
                                        <div className="relative flex flex-col items-center">

                                            {/* Node Circle */}
                                            <div
                                                className={`
                                                    w-20 h-20 rounded-full border-2 flex items-center justify-center relative z-20 cursor-pointer transition-all duration-300
                                                    ${selectedStepId === step.id ? 'scale-110 border-accent bg-secondary shadow-[0_0_25px_rgba(100,255,218,0.5)]' :
                                                        step.status === 'completed' ? 'border-accent bg-secondary text-accent' :
                                                            'border-border bg-secondary text-text-secondary hover:border-accent/40'}
                                                `}
                                                onMouseUp={(e) => {
                                                    e.stopPropagation(); // Prevent drag end from affecting click if simple
                                                    handleNodeClick(step.id);
                                                }}
                                            >
                                                <div className={`${selectedStepId === step.id ? 'text-accent animate-pulse' : ''}`}>
                                                    {step.status === 'completed' || selectedStepId === step.id ? <step.icon className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                                                </div>

                                                {/* Ripple Effect active */}
                                                {selectedStepId === step.id && (
                                                    <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping opacity-20"></div>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <span className={`mt-3 font-semibold text-sm transition-colors ${selectedStepId === step.id ? 'text-text-primary scale-105' : 'text-text-secondary'}`}>
                                                {step.label}
                                            </span>

                                            {/* Detail Popover (Visible if selected) */}
                                            <AnimatePresence mode="wait">
                                                {selectedStepId === step.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-[140%] w-72 bg-secondary/95 backdrop-blur-xl border border-accent/30 rounded-2xl p-5 shadow-2xl z-30"
                                                        onMouseDown={(e) => e.stopPropagation()} // Prevent pan start on card
                                                    >
                                                        {/* Arrow */}
                                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary border-t border-l border-accent/30 rotate-45"></div>

                                                        <h4 className="font-bold text-text-primary mb-2 text-lg text-center">{step.details.title}</h4>
                                                        <p className="text-xs text-text-secondary mb-4 leading-relaxed text-center border-b border-white/5 pb-3">
                                                            {step.details.description}
                                                        </p>
                                                        <ul className="space-y-2">
                                                            {step.details.points.map((point, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0 shadow-[0_0_5px_currentColor]"></div>
                                                                    {point}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                        </div>

                                        {/* Connector (if not last item) */}
                                        {index < timelineSteps.length - 1 && (
                                            <div className="flex-1 w-24 h-[2px] bg-white/10 relative mx-2">
                                                {/* Glow Line if step is completed or it connects to selected */}
                                                <div className={`absolute inset-0 bg-gradient-to-r from-accent to-accent/50 transition-all duration-500 ${timelineSteps[index + 1].status === 'completed' || timelineSteps[index + 1].status === 'active' ? 'w-full opacity-100' : 'w-0 opacity-0'
                                                    }`}></div>
                                            </div>
                                        )}

                                    </React.Fragment>
                                ))}

                                {/* Branches (Static Decor at end) */}
                                <div className="relative flex flex-col justify-center h-40 ml-4 opacity-50">
                                    <div className="absolute top-0 left-0 w-16 h-20 border-b-2 border-r-2 border-white/10 rounded-br-3xl transform -translate-y-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-3xl transform translate-y-10"></div>
                                    <div className="absolute top-[-30px] right-[-24px] transform translate-x-full"><Lock className="w-5 h-5 text-text-secondary" /></div>
                                    <div className="absolute bottom-[-30px] right-[-24px] transform translate-x-full"><Lock className="w-5 h-5 text-text-secondary" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roadmap;
