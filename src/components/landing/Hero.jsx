import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Database, ChevronRight, ChevronLeft } from 'lucide-react';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "CodeMentor AI",
            icon: Cpu,
            text: "Your personal AI coding guide.",
            subtext: "Level up your skills.",
            color: "text-accent",
            glow: "shadow-[0_0_50px_rgba(100,255,218,0.3)]",
            progress: "w-2/3"
        },
        {
            title: "Smart Analysis",
            icon: Terminal,
            text: "Deep code analysis on every line.",
            subtext: "Find bugs before they happen.",
            color: "text-purple",
            glow: "shadow-[0_0_50px_rgba(189,52,254,0.3)]",
            progress: "w-1/2"
        },
        {
            title: "Knowledge Hub",
            icon: Database,
            text: "Access to world-class resources.",
            subtext: "Master any technology stack.",
            color: "text-blue-400",
            glow: "shadow-[0_0_50px_rgba(59,130,246,0.3)]",
            progress: "w-3/4"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="min-h-screen flex items-center justify-between px-20 pt-20 bg-primary relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple/10 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10"></div>

            {/* Left Content */}
            <div className="max-w-xl z-10">
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    {/* Icon Placeholder */}
                    <div className="w-12 h-12 mb-6 text-white">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                            <line x1="12" y1="2" x2="12" y2="12" />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-6 text-white">
                        Stop guessing where to start.
                    </h1>
                    <p className="text-xl text-text-secondary mb-8">
                        Get personalized AI-powered feedback on your code and a roadmap to mastery.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                            Get Started Free
                        </button>
                        <button className="px-8 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-all">
                            View Demo
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Right Content - Cards Slider */}
            <div className="relative z-10 w-[400px] h-[500px] flex items-center justify-center">
                {/* Simulating the stacked cards effect */}
                <div className="absolute inset-0 w-[350px] h-[450px] bg-[#1a1b2e] rounded-2xl border border-purple/30 transform rotate-6 scale-95 opacity-20 -z-20 ml-auto mr-0"></div>
                <div className="absolute inset-0 w-[350px] h-[450px] bg-[#1a1b2e] rounded-2xl border border-purple/30 transform rotate-3 scale-95 opacity-40 -z-10 ml-auto mr-0"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className={`w-[350px] h-[450px] bg-[#0f1120] rounded-2xl border border-white/10 ${slides[currentSlide].glow} relative overflow-hidden flex flex-col items-center p-8 text-center ml-auto`}
                    >
                        <h3 className={`text-xl font-bold mb-12 tracking-widest uppercase ${slides[currentSlide].color}`}>
                            {slides[currentSlide].title}
                        </h3>

                        {/* Graphic Area */}
                        <div className="w-44 h-44 mb-10 rounded-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center relative shadow-inner">
                            <div className={`absolute inset-0 border border-white/5 rounded-full ${currentSlide === 0 ? 'animate-pulse' : ''}`}></div>
                            {React.createElement(slides[currentSlide].icon, {
                                className: `w-20 h-20 opacity-80 ${slides[currentSlide].color}`,
                                strokeWidth: 1.5
                            })}
                        </div>

                        <div className="mt-auto w-full">
                            <div className="w-full h-1 bg-white/5 mb-4 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: slides[currentSlide].progress.replace('w-', '') + '%' }}
                                    className={`h-full bg-gradient-to-r from-accent via-purple to-accent`}
                                ></motion.div>
                            </div>
                            <p className="text-sm text-text-primary font-medium">{slides[currentSlide].text}</p>
                            <p className="text-xs text-text-secondary mt-1">{slides[currentSlide].subtext}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Navigation */}
                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
                    <button onClick={prevSlide} className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'w-6 bg-accent' : 'bg-white/20 hover:bg-white/40'}`}
                            ></button>
                        ))}
                    </div>
                    <button onClick={nextSlide} className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </section>
    );
};

export default Hero;
