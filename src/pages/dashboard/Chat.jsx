import React, { useState } from 'react';
import { Sparkles, Code, FileText, Send, ChevronDown, Check } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Chat = () => {
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    const [language, setLanguage] = useState('Auto Detect');
    const [showToast, setShowToast] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const languages = [
        'Auto Detect',
        'JavaScript',
        'Python',
        'Java',
        'C++',
        'TypeScript',
        'C#'
    ];

    const handleSubmit = async () => {
        if (!problem || !solution) {
            alert('Please fill in both the problem and your solution.');
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                alert('You must be logged in to submit.');
                return;
            }

            const response = await fetch('https://rqqdmxvhhrxdghnhefmp.supabase.co/functions/v1/code_submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    problem_code: problem,
                    solution_code: solution
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Submission failed');
            }

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
        } catch (error) {
            console.error('Submission error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-140px)] flex flex-col relative">

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-0 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-secondary border border-accent/20 text-text-primary px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-xl">
                        <div className="bg-green-500/20 p-2 rounded-lg text-green-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Success!</h4>
                            <p className="text-xs text-text-secondary">Solution Submitted Successfully!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-2">
                    Solve & Learn <Sparkles className="w-6 h-6 text-accent" />
                </h1>
                <p className="text-text-secondary">Select path to continue learning</p>
                {/* Search bar removed as per request */}
            </div>

            {/* Main Content Area - Two Columns */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">

                {/* Left Column: Problem */}
                <div className="flex flex-col bg-secondary/30 backdrop-blur-xl border border-border rounded-2xl shadow-2xl">
                    <div className="p-4 border-b border-border bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-accent font-semibold">
                            <FileText className="w-5 h-5" />
                            <h3>Problem</h3>
                        </div>
                        {/* Decorative line */}
                        <div className="h-1 w-16 bg-accent rounded-full shadow-[0_0_10px_#64ffda]"></div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col gap-4">
                        <textarea
                            className="flex-1 w-full bg-primary/50 text-text-primary p-4 rounded-xl border border-border focus:border-accent/50 focus:ring-1 focus:ring-accent/50 focus:outline-none resize-none placeholder-text-secondary/50 transition-all shadow-inner"
                            placeholder="Paste your problematic code or describe on your issue here..."
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                        />

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-text-secondary mb-1 block pl-1">Code Language</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsLangOpen(!isLangOpen)}
                                        className="w-full bg-primary/50 border border-border rounded-lg px-4 py-2 text-text-primary focus:border-accent/50 focus:outline-none flex items-center justify-between transition-all hover:bg-white/5 active:scale-[0.99] shadow-sm"
                                    >
                                        <span className="truncate">{language}</span>
                                        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Custom Dropdown Menu */}
                                    {isLangOpen && (
                                        <>
                                            {/* Backdrop with no blurring to catch clicks outside */}
                                            <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsLangOpen(false)}></div>

                                            {/* Dropdown Content */}
                                            <div className="absolute top-full mt-2 w-full bg-secondary/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                <div className="p-1 max-h-48 overflow-y-auto custom-scrollbar">
                                                    {languages.map((lang) => (
                                                        <button
                                                            key={lang}
                                                            onClick={() => {
                                                                setLanguage(lang);
                                                                setIsLangOpen(false);
                                                            }}
                                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${language === lang
                                                                ? 'bg-accent/10 text-accent font-medium'
                                                                : 'text-text-primary hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <span>{lang}</span>
                                                            {language === lang && <Check className="w-4 h-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Solution (Writable) */}
                <div className="flex flex-col bg-secondary/30 backdrop-blur-xl border border-border rounded-2xl overflow-hidden shadow-2xl relative group">
                    {/* Glowing border effect on hover */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"></div>

                    <div className="p-4 border-b border-border bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-purple-400 font-semibold">
                            <Code className="w-5 h-5" />
                            <h3>My Solution</h3>
                        </div>
                        <div className="h-1 w-16 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></div>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="h-full relative font-mono text-sm">
                            <textarea
                                className="w-full h-full bg-primary/80 text-text-primary p-4 rounded-xl border border-border focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 focus:outline-none resize-none placeholder-text-secondary/50 transition-all shadow-inner"
                                placeholder="// Write your solution here..."
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                spellCheck="false"
                            />
                        </div>
                    </div>

                    <div className="p-3 bg-white/5 border-t border-border text-xs text-text-secondary flex justify-between items-center">
                        <span>Write your fix above before submitting to AI</span>
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="flex justify-center pb-4">
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 group"
                >
                    <span>Submit to AI Mentor</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

        </div>
    );
};

export default Chat;
