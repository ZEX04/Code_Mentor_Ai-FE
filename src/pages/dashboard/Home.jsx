import React, { useMemo } from 'react';
import { Play, Upload, Target, ArrowRight, Rocket } from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
    const { reports } = useReports();
    const navigate = useNavigate();

    // User Data
    const user = JSON.parse(localStorage.getItem('user'));
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';
    const userRole = user?.user_metadata?.role || 'Developer'; // Default role

    // Calculated Stats
    const stats = useMemo(() => {
        const projectsReviewed = reports.length;

        // Calculate total lines of code across all reports
        // If 'lines' column exists in DB use it, else count lines in code snippets
        const totalLinesOfCode = reports.reduce((acc, report) => {
            const snippetLines = report.snippet ? report.snippet.split('\n').length : 0;
            const solutionLines = report.suggested_solution ? report.suggested_solution.split('\n').length : 0;
            return acc + snippetLines + solutionLines;
        }, 0);

        return { projectsReviewed, totalLinesOfCode };
    }, [reports]);

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-[#4F6EF7] via-[#9F5DFA] to-[#4F6EF7] p-10 shadow-lg overflow-hidden border border-white/10">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">
                            Hello, {userName} <span className="animate-wave inline-block">👋</span>
                        </h1>
                        <p className="text-xl font-semibold text-white/90 drop-shadow-sm">
                            {userRole} • Ready to code?
                        </p>
                    </div>

                    {/* Quick Stats in Banner */}
                    <div className="flex gap-6 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{stats.projectsReviewed}</p>
                            <p className="text-xs text-white/80 uppercase tracking-wider">Projects</p>
                        </div>
                        <div className="w-px bg-white/20 h-10 self-center"></div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{stats.totalLinesOfCode}</p>
                            <p className="text-xs text-white/80 uppercase tracking-wider">Lines of Code</p>
                        </div>
                    </div>
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
                    Keep going! Next Milestone : <span className="text-text-primary font-bold">Advanced React Patterns</span>
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
                    onClick={() => navigate('/dashboard/submit')}
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

const ActionCard = ({ icon: Icon, iconColor, iconBg, title, subtitle, buttonText, buttonColor, glow, onClick }) => (
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

        <button
            onClick={onClick}
            className={`relative mt-auto w-full py-3.5 rounded-xl border border-border text-text-primary font-semibold tracking-wide shadow-lg hover:brightness-125 transition-all active:scale-95 ${buttonColor} backdrop-blur-sm z-10`}
        >
            {buttonText}
        </button>
    </div>
);


export default DashboardHome;
