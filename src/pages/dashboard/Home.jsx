import React from 'react';
import { Play, Upload, Target, ArrowRight, Rocket } from 'lucide-react';

const DashboardHome = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.user_metadata?.full_name || user?.email || 'Friend';

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#4F6EF7] via-[#9F5DFA] to-[#4F6EF7] p-10 shadow-lg overflow-hidden border border-white/10">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">
                        Hello , {userName} <span className="animate-wave inline-block">👋</span>
                    </h1>
                    <p className="text-2xl font-semibold text-white/90 drop-shadow-sm">Your Ai Mentor is ready .</p>
                </div>
                {/* Glossy overlay effect */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            </div>

            {/* Progress Tracker Bar - Glassmorphism */}
            <div className="relative rounded-3xl bg-secondary/60 backdrop-blur-xl border border-border p-6 shadow-2xl overflow-hidden">
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="text-lg font-bold text-text-primary">Front End Track - 65% Complete</h3>
                    <Rocket className="w-6 h-6 text-accent animate-pulse" />
                </div>

                {/* Custom Progress Bar */}
                <div className="w-full h-8 bg-primary/50 backdrop-blur-sm rounded-full p-1 relative z-10 border border-border">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(100,255,218,0.5)] relative transition-all duration-1000 ease-out"
                        style={{ width: '65%' }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full bg-white/20 animate-shimmer"></div>
                    </div>
                </div>

                <p className="mt-4 text-text-primary/90 font-medium relative z-10">
                    Keep going! Next MileStone : <span className="text-text-primary font-bold">Advanced React patterns .</span>
                </p>
            </div>

            {/* Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Continue Chat Card */}
                <ActionCard
                    icon={Play}
                    iconColor="text-purple-400"
                    iconBg="bg-purple-500/20"
                    title={<>continue last <span className="text-purple-400">Chat</span></>}
                    subtitle="Last session: understanding Redux Toolkit , 5hours ago"
                    buttonText="Resume session"
                    buttonColor="bg-primary/50"
                    glow="group-hover:shadow-[0_0_30px_rgba(189,52,254,0.3)]"
                />

                {/* Upload Code Card */}
                <ActionCard
                    icon={Upload}
                    iconColor="text-pink-400"
                    iconBg="bg-pink-500/20"
                    title={<>Upload <span className="text-pink-300">Code</span></>}
                    subtitle="Submit your Project for instant Feedback and Suggestion"
                    buttonText="Select File"
                    buttonColor="bg-primary/50"
                    glow="group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                />

                {/* Today's Goal Card */}
                <ActionCard
                    icon={Target}
                    iconColor="text-accent"
                    iconBg="bg-accent/20"
                    title={<>Today's <span className="text-purple-400">Goal:</span><br /> Master Re<span className="text-purple-400">act Hooks</span></>}
                    subtitle="Continue the interactive tutorial and build a costume one"
                    buttonText="Start tutorial"
                    buttonColor="bg-primary/50"
                    glow="group-hover:shadow-[0_0_30px_rgba(100,255,218,0.3)]"
                />

            </div>
        </div>
    );
};

const ActionCard = ({ icon: Icon, iconColor, iconBg, title, subtitle, buttonText, buttonColor, glow }) => (
    <div className={`relative rounded-3xl bg-secondary/40 backdrop-blur-2xl border border-border p-8 flex flex-col items-center text-center transition-all duration-300 group ${glow} hover:-translate-y-1 shadow-2xl`}>
        {/* Glassmorphic gradient overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

        {/* Diagonal shine effect */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Custom Icon Box with glass effect */}
        <div className={`relative w-16 h-16 rounded-2xl ${iconBg} border border-border backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg`}>
            <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>

        <h3 className="text-xl font-bold text-text-primary mb-3 leading-tight relative z-10">
            {title}
        </h3>

        <p className="text-text-secondary text-sm mb-8 leading-relaxed max-w-[80%] relative z-10">
            {subtitle}
        </p>

        <button className={`relative mt-auto w-full py-3.5 rounded-xl border border-border text-text-primary font-semibold tracking-wide shadow-lg hover:brightness-125 transition-all active:scale-95 ${buttonColor} backdrop-blur-sm z-10`}>
            {buttonText}
        </button>
    </div>
);


export default DashboardHome;
