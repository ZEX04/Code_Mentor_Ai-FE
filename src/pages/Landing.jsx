import React from 'react';
import { FileCode, Monitor, FileText } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import FeatureSection from '../components/landing/FeatureSection';
import Contact from '../components/landing/Contact';

const Landing = () => {
    return (
        <div className="min-h-screen bg-primary font-sans text-text-primary overflow-x-hidden">
            <Navbar />
            <Hero />

            <FeatureSection
                title={<>Not sure where you stand as a <br /> programmer?</>}
                description="Code Mentor analyzes your code to identify your real skill level. It shows you exactly what's missing and what's holding you back from becoming a developer who truly understands every line they write."
                icon={FileCode}
                imageContent={
                    <div className="w-full max-w-sm bg-[#0a1128] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-[#1a2540] px-3 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">analysis.cpp</span>
                        </div>
                        <div className="p-4 bg-primary/20">
                            <pre className="text-xs font-mono text-gray-300 space-y-1">
                                <div className="text-purple-400">void</div> <div className="text-blue-400 inline">evaluate</div>() &#123;
                                <br />  <div className="text-gray-500 italic">// Analyzing patterns...</div>
                                <br />  <div className="text-green-400">if</div> (logic_error) &#123;
                                <br />    suggest_fix();
                                <br />  &#125;
                                <br />&#125;
                            </pre>
                        </div>
                    </div>
                }
            />

            <FeatureSection
                reversed
                title={<>We don't just point out problems — <br /> guide you forward</>}
                description="After the assessment, you receive a detailed report highlighting your strengths and weaknesses, along with a personalized learning roadmap designed specifically for your goals and current level."
                icon={Monitor}
                imageContent={
                    <div className="w-full max-w-sm bg-[#0a1128] rounded-xl border border-white/10 overflow-hidden shadow-2xl scale-110">
                        <div className="bg-[#1a2540] px-3 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">roadmap.json</span>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
                                    <div className="h-full w-3/4 bg-accent animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                        <div className="w-8 h-2 bg-purple/40 rounded-full"></div>
                                    </div>
                                    <div className="h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                        <div className="w-8 h-2 bg-accent/40 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

            <FeatureSection
                title={<>And we don't leave you alone on the <br /> journey</>}
                description="We provide carefully selected learning resources for each gap you need to fix, plus hands-on practice through Codeforces problems to make sure real progress happens."
                icon={FileText}
                imageContent={
                    <div className="w-full max-w-sm bg-[#0a1128] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-[#1a2540] px-3 py-2 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">resources.md</span>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <div className="h-2 w-3/4 bg-white/10 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                }
            />

            <Contact />
        </div>
    );
};

export default Landing;
