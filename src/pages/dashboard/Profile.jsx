import React, { useEffect, useState, useMemo } from 'react';
import { Mail, MapPin, Link as LinkIcon, Twitter, Github, Linkedin, Camera, Code, Hash, Calendar, Trophy, Loader2, User, X, Check } from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const Profile = () => {
    const { reports } = useReports();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ full_name: '', role: '' });
    const [isSaving, setIsSaving] = useState(false);

    // 1. Get User and Calculate Stats

    // Stats Calculation
    const statsResult = useMemo(() => {
        const projectsReviewed = reports.length;
        const totalLines = reports.reduce((acc, r) => {
            const s = r.snippet ? r.snippet.split('\n').length : 0;
            const sol = r.suggested_solution ? r.suggested_solution.split('\n').length : 0;
            return acc + s + sol;
        }, 0);

        // Format K for lines (e.g. 1500 -> 1.5K)
        const formatLines = (num) => {
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num;
        };

        return {
            reviewed: projectsReviewed,
            lines: formatLines(totalLines)
        };
    }, [reports]);

    // 2. Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile(data);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]); // Warn: Check dependency

    const displayUser = {
        name: profile?.full_name || user?.user_metadata?.full_name || 'CodeMentor User',
        role: profile?.role || user?.user_metadata?.role || 'Full Stack Developer',
        email: profile?.email || user?.email,
        location: profile?.location || 'Global',
        website: profile?.website || 'portfolio.dev',
        avatar: profile?.avatar_url || null
    };

    const handleEditClick = () => {
        setEditForm({
            full_name: displayUser.name,
            role: displayUser.role === 'Full Stack Developer' && !profile?.role ? '' : displayUser.role
        });
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const updates = {
                id: user.id,
                full_name: editForm.full_name,
                role: editForm.role || 'Full Stack Developer',
                updated_at: new Date()
            };
            
            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            
            setProfile(prev => ({ ...prev, ...updates }));
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const derivedSkills = useMemo(() => {
        if (!reports || reports.length === 0) return [];
        
        const langData = {};
        reports.forEach(r => {
            if (!r.language || r.language === 'Not detected') return;
            // Language is already normalized by formatLanguageName
            const lang = r.language.trim();
            
            if (!langData[lang]) {
                langData[lang] = {
                    maxScore: 0,
                    count: 0,
                    metrics: { readability: 0, documentation: 0, efficiency: 0, problemSolving: 0, edgeCases: 0, correctness: 0 }
                };
            }
            
            const score = Math.round(Number(r.score) || 0);
            if (score > langData[lang].maxScore) {
                langData[lang].maxScore = score;
            }
            
            langData[lang].count++;
            if (r.metrics) {
                langData[lang].metrics.readability += r.metrics.readability || 0;
                langData[lang].metrics.documentation += r.metrics.documentation || 0;
                langData[lang].metrics.efficiency += r.metrics.efficiency || 0;
                langData[lang].metrics.problemSolving += r.metrics.problemSolving || 0;
                langData[lang].metrics.edgeCases += r.metrics.edgeCases || 0;
                langData[lang].metrics.correctness += r.metrics.correctness || 0;
            }
        });

        const colors = ["bg-blue-400", "bg-yellow-400", "bg-cyan-400", "bg-green-400", "bg-pink-400", "bg-purple-400", "bg-orange-400"];
        
        return Object.entries(langData)
            .map(([name, data]) => {
                const avgMetrics = {
                    readability: Math.round(data.metrics.readability / data.count),
                    documentation: Math.round(data.metrics.documentation / data.count),
                    efficiency: Math.round(data.metrics.efficiency / data.count),
                    problemSolving: Math.round(data.metrics.problemSolving / data.count),
                    edgeCases: Math.round(data.metrics.edgeCases / data.count),
                    correctness: Math.round(data.metrics.correctness / data.count)
                };
                return { name, progress: data.maxScore, metrics: avgMetrics };
            })
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 5)
            .map((item, index) => ({ ...item, color: colors[index % colors.length] }));
    }, [reports]);

    const derivedAchievements = useMemo(() => {
        if (!reports || reports.length === 0) return [];
        
        const achieves = [];
        
        // 1. First Review
        achieves.push({
            title: "First Review",
            date: reports[reports.length - 1]?.date || "Just now",
            icon: Trophy,
            color: "text-red-500",
            bg: "bg-red-500/20"
        });

        // 2. Consistent Coder
        if (reports.length >= 5) {
            achieves.push({
                title: "5+ Submissions",
                date: reports[reports.length - 5]?.date || "Recently",
                icon: Trophy,
                color: "text-yellow-500",
                bg: "bg-yellow-500/20"
            });
        }

        // 3. Excellence
        const excellentReport = reports.find(r => r.status === 'Excellent' || r.score >= 90);
        if (excellentReport) {
            achieves.push({
                title: "Excellence",
                date: excellentReport.date,
                icon: Trophy,
                color: "text-green-500",
                bg: "bg-green-500/20"
            });
        }

        // 4. Language Master
        const masterReport = reports.find(r => r.score >= 95);
        if (masterReport) {
            achieves.push({
                title: `${masterReport.language} Master`,
                date: masterReport.date,
                icon: Trophy,
                color: "text-purple-500",
                bg: "bg-purple-500/20"
            });
        }
        
        return achieves.slice(0, 4);
    }, [reports]);

    if (loading || authLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
        );
    }

    const masteredCount = derivedSkills.filter(skill => skill.progress >= 95).length;

    const stats = [
        { label: "Projects Reviewed", value: statsResult.reviewed, icon: Code, color: "bg-blue-500" },
        { label: "Lines of Code", value: statsResult.lines, icon: Hash, color: "bg-purple-500" },
        { label: "Learning Streak", value: `${profile?.current_streak || 0} days`, icon: Calendar, color: "bg-orange-500" },
        { label: "Skills Mastered", value: masteredCount, icon: Trophy, color: "bg-green-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto pb-10">
            {/* Profile Header / Banner */}
            <div className="relative mb-8">
                <div className="h-48 w-full rounded-3xl bg-gradient-to-r from-secondary to-primary overflow-hidden relative border border-border">
                    {/* Decorative background similar to screenshot */}
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-purple/20 to-transparent"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                {/* Avatar & Info - Positioned inside/over banner to match "Welcome" card style but for Profile */}
                <div className="absolute top-1/2 left-10 -translate-y-1/2 flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent to-purple p-[2px]">
                            <div className="w-full h-full bg-secondary rounded-2xl flex items-center justify-center overflow-hidden">
                                {displayUser.avatar ? (
                                    <img src={displayUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-text-secondary" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">{displayUser.name}</h1>
                        <p className="text-text-secondary">{displayUser.role}</p>
                    </div>
                </div>

            </div>

            {/* Stats Grid - Moved here from Home.jsx */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-secondary/50 backdrop-blur border border-border p-6 rounded-xl hover:border-accent/30 transition-all group">
                        <div className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-20 flex items-center justify-center mb-4 text-text-primary group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-text-secondary text-sm font-medium">{stat.label}</h3>
                        <p className="text-3xl font-bold text-text-primary mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Skills (from Home) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Technical Skills */}
                    <div className="bg-secondary/50 backdrop-blur border border-border p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-primary">Technical Skills</h3>
                        </div>
                        {derivedSkills.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-primary/20 rounded-xl border border-white/5">
                                <Code className="w-10 h-10 text-text-secondary opacity-50 mb-3" />
                                <h4 className="text-text-primary font-medium mb-1">Awaiting Data</h4>
                                <p className="text-xs text-text-secondary max-w-[200px] mx-auto">Waiting for your first report. Submit code to generate your technical skill profile!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {derivedSkills.map((skill, index) => (
                                    <div key={index} className="group relative cursor-default">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{skill.name}</span>
                                            <span className="text-sm text-text-secondary">{skill.progress}% (Best)</span>
                                        </div>
                                        <div className="w-full bg-primary rounded-full h-2">
                                            <div
                                                className={`${skill.color} h-2 rounded-full transition-all duration-1000`}
                                                style={{ width: `${skill.progress}%` }}
                                            ></div>
                                        </div>
                                        
                                        {/* Hover Tooltip for Average Metrics */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-5 rounded-2xl bg-[#0a1128] border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0a1128] border-b border-r border-white/10 rotate-45"></div>
                                            <h4 className="text-sm font-bold text-white mb-4 text-center border-b border-white/5 pb-3 uppercase tracking-wide">{skill.name} Average Quality</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Readability', val: skill.metrics.readability, c: 'bg-blue-500' },
                                                    { label: 'Documentation', val: skill.metrics.documentation, c: 'bg-indigo-500' },
                                                    { label: 'Efficiency', val: skill.metrics.efficiency, c: 'bg-teal-500' },
                                                    { label: 'Problem Solving', val: skill.metrics.problemSolving, c: 'bg-orange-500' },
                                                    { label: 'Edge Cases', val: skill.metrics.edgeCases, c: 'bg-red-500' },
                                                    { label: 'Correctness', val: skill.metrics.correctness, c: 'bg-green-500' }
                                                ].map((m, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-xs text-white/70 mb-1.5 font-medium">
                                                            <span>{m.label}</span>
                                                            <span className="text-white font-bold">{m.val}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                                            <div className={`h-full ${m.c}`} style={{ width: `${m.val}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Additional Info Block Removed per request */}
                </div>

                {/* Right Column: Achievements (from Home) */}
                <div>
                    <div className="bg-secondary/50 backdrop-blur border border-border p-6 rounded-xl flex flex-col">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Achievements</h3>

                        {derivedAchievements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-primary/20 rounded-xl border border-white/5 flex-1 min-h-[200px]">
                                <Trophy className="w-10 h-10 text-text-secondary opacity-50 mb-3" />
                                <h4 className="text-text-primary font-medium mb-1">No Achievements Yet</h4>
                                <p className="text-xs text-text-secondary">Submit your first code to start unlocking achievements!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {derivedAchievements.map((achieve, idx) => (
                                    <div key={idx} className="bg-primary/50 p-4 rounded-lg border border-border flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                                        <div className={`w-10 h-10 ${achieve.bg} rounded-full flex items-center justify-center ${achieve.color} mb-2`}>
                                            <achieve.icon className="w-5 h-5" />
                                        </div>
                                        <h4 className="font-bold text-text-primary text-sm">{achieve.title}</h4>
                                        <p className="text-xs text-text-secondary mt-1">{achieve.date}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a1128] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-1">Specialization / Role</label>
                                <input 
                                    type="text" 
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-accent transition-colors"
                                    placeholder="e.g. Full Stack Developer"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
