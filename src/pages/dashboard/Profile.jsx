import React from 'react';
import { Mail, MapPin, Link as LinkIcon, Twitter, Github, Linkedin, Camera, Code, Hash, Calendar, Trophy } from 'lucide-react';

const Profile = () => {
    // Stats from Home.jsx
    const stats = [
        { label: "Projects Reviewed", value: "24", icon: Code, color: "bg-blue-500" },
        { label: "Lines of Code", value: "15.2K", icon: Hash, color: "bg-purple-500" },
        { label: "Learning Streak", value: "15 days", icon: Calendar, color: "bg-orange-500" },
        { label: "Skills Mastered", value: "8", icon: Trophy, color: "bg-green-500" },
    ];

    const skills = [
        { name: "JavaScript", progress: 90, color: "bg-blue-400" },
        { name: "React", progress: 85, color: "bg-cyan-400" },
        { name: "Python", progress: 75, color: "bg-yellow-400" },
        { name: "CSS", progress: 83, color: "bg-pink-400" },
        { name: "Node.js", progress: 70, color: "bg-green-400" },
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
                                {/* Placeholder Avatar Img or Icon */}
                                <span className="text-4xl">👋</span>
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-full border border-border text-text-primary hover:bg-accent hover:text-primary transition-colors">
                            <Camera className="w-3 h-3" />
                        </button>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Ebram Emad</h1>
                        <p className="text-text-secondary">Full Stack Developer • AI Enthusiast</p>
                    </div>
                </div>

                <div className="absolute top-1/2 right-10 -translate-y-1/2 flex gap-3">
                    <button className="px-6 py-2 border border-border bg-secondary text-text-primary font-medium rounded-lg hover:bg-white/10 transition-colors">
                        Edit Profile
                    </button>
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
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-text-primary">{skill.name}</span>
                                        <span className="text-sm text-text-secondary">{skill.progress}%</span>
                                    </div>
                                    <div className="w-full bg-primary rounded-full h-2">
                                        <div
                                            className={`${skill.color} h-2 rounded-full transition-all duration-1000`}
                                            style={{ width: `${skill.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info Block (About/Socials) Merged */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-secondary/50 backdrop-blur border border-border rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-text-primary mb-4">About Me</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <MapPin className="w-4 h-4 text-accent" /> Cairo, Egypt
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <Mail className="w-4 h-4 text-accent" /> ebram@example.com
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-secondary">
                                    <LinkIcon className="w-4 h-4 text-accent" /> ebram.dev
                                </div>
                            </div>
                        </div>
                        <div className="bg-secondary/50 backdrop-blur border border-border rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-text-primary mb-4">Socials</h3>
                            <div className="flex gap-4">
                                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-text-primary transition-colors"><Github className="w-5 h-5" /></a>
                                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-blue-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Achievements (from Home) */}
                <div>
                    <div className="bg-secondary/50 backdrop-blur border border-border p-6 rounded-xl flex flex-col">
                        <h3 className="text-lg font-bold text-text-primary mb-6">Achievements</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary/50 p-4 rounded-lg border border-border flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-text-primary text-sm">First Review</h4>
                                <p className="text-xs text-text-secondary mt-1">Jan 2, 2025</p>
                            </div>
                            <div className="bg-primary/50 p-4 rounded-lg border border-border flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 mb-2">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-text-primary text-sm">JS Master</h4>
                                <p className="text-xs text-text-secondary mt-1">Jan 10, 2025</p>
                            </div>
                            <div className="bg-primary/50 p-4 rounded-lg border border-border flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-500 mb-2">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-text-primary text-sm">30 Day Streak</h4>
                                <p className="text-xs text-text-secondary mt-1">Jan 15, 2025</p>
                            </div>
                            <div className="bg-primary/50 p-4 rounded-lg border border-border flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 mb-2">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-text-primary text-sm">React Expert</h4>
                                <p className="text-xs text-text-secondary mt-1">Jan 20, 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
