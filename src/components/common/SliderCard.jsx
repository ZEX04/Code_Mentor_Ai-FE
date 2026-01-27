import React from 'react';
import { Monitor } from 'lucide-react';

const SliderCard = ({
    title = "CODEMENTOR AI",
    Icon = Monitor,
    subtext1 = "Your personal AI coding guide.",
    subtext2 = "Level up your skills.",
    progress = 50,
    theme = "purple" // purple, blue, pink
}) => {

    // Theme configuration
    const themes = {
        purple: {
            border: "border-purple-500",
            shadow: "shadow-[0_0_50px_rgba(168,85,247,0.25)]",
            textGradient: "from-teal-300 to-purple-400",
            iconBg: "from-teal-500/20 to-purple-500/20",
            barGradient: "from-teal-400 to-purple-500",
            glow: "rgba(168,85,247,0.1)"
        },
        blue: {
            border: "border-cyan-500",
            shadow: "shadow-[0_0_50px_rgba(34,211,238,0.25)]",
            textGradient: "from-blue-400 to-cyan-400",
            iconBg: "from-blue-500/20 to-cyan-500/20",
            barGradient: "from-blue-400 to-cyan-500",
            glow: "rgba(34,211,238,0.1)"
        },
        pink: {
            border: "border-pink-500",
            shadow: "shadow-[0_0_50px_rgba(236,72,153,0.25)]",
            textGradient: "from-pink-400 to-rose-400",
            iconBg: "from-pink-500/20 to-rose-500/20",
            barGradient: "from-pink-400 to-rose-500",
            glow: "rgba(236,72,153,0.1)"
        }
    };

    const t = themes[theme] || themes.purple;

    return (
        <div className="relative w-[320px] h-[400px] group perspective">

            {/* Background Stack Cards (Pseudo-3D effect) */}
            <div className={`absolute top-4 left-6 w-full h-full rounded-[30px] bg-[#1a0b2e] border ${t.border}/30 opacity-40 scale-95 -z-20 transform rotate-3 transition-transform duration-500 group-hover:rotate-6`}></div>
            <div className={`absolute top-2 left-3 w-full h-full rounded-[30px] bg-[#130924] border ${t.border}/50 opacity-60 scale-[0.98] -z-10 transform rotate-1 transition-transform duration-500 group-hover:rotate-3`}></div>

            {/* Main Card */}
            <div className={`relative w-full h-full bg-[#0a0515] rounded-[30px] border ${t.border}/80 p-8 flex flex-col items-center justify-between ${t.shadow} overflow-hidden transition-all duration-300 group-hover:-translate-y-2`}>

                {/* Neon Glow Background */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none" style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}></div>

                {/* Title */}
                <h3 className={`text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${t.textGradient} mt-4 relative z-10 text-center uppercase`}>
                    {title}
                </h3>

                {/* Icon Circle */}
                <div className="w-40 h-40 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    {/* Inner Circle Gradient Border */}
                    <div className={`absolute inset-0 rounded-full border border-transparent bg-gradient-to-b ${t.iconBg} mask-linear`}></div>

                    <Icon className="w-16 h-16 text-white stroke-[1.5]" />
                </div>

                {/* Bottom Section */}
                <div className="w-full text-center space-y-4">
                    {/* Progress Bar */}
                    <div className="w-3/4 mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${t.barGradient} rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-gray-400 text-sm">{subtext1}</p>
                        <p className="text-gray-400 text-sm">{subtext2}</p>
                    </div>
                </div>

                {/* Border Glow (Inset) */}
                <div className={`absolute inset-0 rounded-[30px] border ${t.border}/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none`}></div>
            </div>
        </div>
    );
};

export default SliderCard;
