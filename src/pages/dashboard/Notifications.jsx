import React, { useState } from 'react';
import { Bell, MessageSquare, Code, Star, Shield, ArrowRight, Check, Clock, Filter } from 'lucide-react';

const Notifications = () => {
    const [filter, setFilter] = useState('All');

    const allNotifications = [
        { id: 1, type: 'review', title: 'Python Script Reviewed', message: 'Your "Data Analysis" script has been reviewed. Score: 92%', time: '2 hours ago', icon: Code, color: 'bg-green-500' },
        { id: 2, type: 'system', title: 'Streak Milestone', message: 'You reached a 7-day learning streak! Keep it up!', time: '5 hours ago', icon: Star, color: 'bg-orange-500' },
        { id: 3, type: 'security', title: 'New Login', message: 'New login detected from Cairo, Egypt.', time: '1 day ago', icon: Shield, color: 'bg-red-500' },
        { id: 4, type: 'review', title: 'React Component Feedback', message: 'Suggestions available for "Navbar" component optimization.', time: '1 day ago', icon: MessageSquare, color: 'bg-blue-500' },
        { id: 5, type: 'system', title: 'Weekly Report Ready', message: 'Your weekly progress report is now available.', time: '2 days ago', icon: Bell, color: 'bg-purple-500' },
        { id: 6, type: 'review', title: 'C++ Algorithm Fix', message: 'Critical issue found in "Sorting.cpp".', time: '3 days ago', icon: Code, color: 'bg-red-500' },
    ];

    const filteredNotifications = filter === 'All'
        ? allNotifications
        : allNotifications.filter(n => n.type === filter.toLowerCase());

    const filters = ['All', 'Review', 'System', 'Security'];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Notifications</h2>
                    <p className="text-text-secondary">Stay updated with all your activities</p>
                </div>

                <div className="flex gap-2 bg-secondary/50 p-1 rounded-xl border border-white/5">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${filter === f ? 'bg-accent text-primary font-bold' : 'text-text-secondary hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredNotifications.map((note) => (
                    <div key={note.id} className="group relative bg-[#111c44] border border-white/5 rounded-2xl p-5 hover:border-accent/30 transition-all hover:-translate-y-1">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none"></div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`w-12 h-12 rounded-xl ${note.color} bg-opacity-20 flex items-center justify-center flex-shrink-0 text-white`}>
                                <note.icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white text-lg">{note.title}</h3>
                                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                                        <Clock className="w-3 h-3" /> {note.time}
                                    </span>
                                </div>
                                <p className="text-text-secondary mt-1">{note.message}</p>

                                <div className="mt-3 flex gap-3">
                                    <button className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                                        View Details <ArrowRight className="w-3 h-3" />
                                    </button>
                                    <button className="text-xs font-semibold text-text-secondary hover:text-white flex items-center gap-1">
                                        Mark as Read <Check className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredNotifications.length === 0 && (
                <div className="text-center py-20 text-text-secondary bg-[#111c44] rounded-2xl border border-white/5">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
