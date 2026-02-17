import React, { useState, useEffect } from 'react';
import { Zap, FileCode, Activity, Eye, Calendar, Code, CheckCircle, AlertTriangle, XCircle, Terminal, Lightbulb, ChevronRight } from 'lucide-react';
import { useReports } from '../../context/ReportContext';
import { getIconByName } from '../../utils/reportUtils';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
    const { reports, isLoading } = useReports();
    const [selectedReportId, setSelectedReportId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (reports && reports.length > 0) {
            if (!selectedReportId) {
                setSelectedReportId(reports[0].id);
            }
        }
    }, [reports, selectedReportId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                    <Terminal className="w-12 h-12 text-text-secondary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-2">No Reports Available</h2>
                    <p className="text-text-secondary max-w-md">
                        Submit your code for analysis to generate your first report.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/80 text-white font-semibold transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];
    const SelectedIcon = getIconByName(selectedReport.iconName);

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 overflow-hidden">

            {/* Left Sidebar - List */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">Code Reviews</h2>
                    <p className="text-text-secondary text-sm">Your generated analysis reports</p>
                </div>

                <div className="space-y-4">
                    {reports.map((report) => {
                        const ReportIcon = getIconByName(report.iconName);
                        return (
                            <div
                                key={report.id}
                                onClick={() => setSelectedReportId(report.id)}
                                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden bg-secondary border hover:bg-text-primary/5 ${selectedReportId === report.id ? 'border-border' : 'border-transparent'}`}
                            >
                                {/* Bottom Gradient Border */}
                                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${report.color}`}></div>

                                {/* Right Skewed Accent */}
                                <div className="absolute top-0 right-0 w-24 h-full bg-white/5 skew-x-[-20deg] transform translate-x-12 group-hover:translate-x-8 transition-transform duration-500"></div>

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        {/* Icon Badge */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} p-[1px] shadow-lg`}>
                                            <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center">
                                                <ReportIcon className="w-6 h-6 text-text-primary" />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-text-primary text-lg tracking-wide group-hover:underline decoration-2 underline-offset-4 decoration-accent transition-all">{report.language}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${report.status === 'Excellent' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                                <span>{report.title}</span>
                                                <span>•</span>
                                                <span>{report.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Content - Detail View */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">

                {/* Header Card */}
                <div className={`rounded-3xl bg-gradient-to-r ${selectedReport.color} p-10 min-h-[240px] flex flex-col justify-center text-white shadow-lg relative overflow-hidden`}>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <SelectedIcon className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold">{selectedReport.language} Code Review</h2>
                            </div>
                            <p className="text-white/80">{selectedReport.title}</p>
                            {selectedReport.sub_title && <p className="text-white/60 text-sm mt-1">{selectedReport.sub_title}</p>}

                            <div className="flex gap-6 mt-6">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="w-4 h-4" /> {selectedReport.date}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Code className="w-4 h-4" /> Score: {selectedReport.score}%
                                </div>
                            </div>
                        </div>
                        {/* Circular Score or Visual */}
                        <div className="hidden md:block">
                            <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-3xl font-bold backdrop-blur-sm bg-white/10">
                                {selectedReport.score}
                            </div>
                        </div>
                    </div>

                    {/* Decorative background circles */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Code Quality */}
                    <div className="bg-secondary/50 backdrop-blur border border-border rounded-2xl p-6">
                        <h3 className="text-text-primary font-bold mb-6">Code Quality</h3>
                        <div className="space-y-6">
                            <SkillBar label="Readability" percentage={selectedReport.quality.readability} color="bg-blue-600" />
                            <SkillBar label="Maintainability" percentage={selectedReport.quality.maintainability} color="bg-purple" />
                            <SkillBar label="Efficiency" percentage={selectedReport.quality.efficiency} color="bg-accent" />
                        </div>
                    </div>

                    {/* Issues Found */}
                    <div className="bg-secondary/50 backdrop-blur border border-border rounded-2xl p-6">
                        <h3 className="text-text-primary font-bold mb-6">Issues Found</h3>
                        <div className="space-y-3 mb-6">
                            <IssueItem label="Critical" count={selectedReport.issues?.critical || 0} color="text-red-500" bg="bg-red-500/10" border="border-red-500/20" />
                            <IssueItem label="Warnings" count={selectedReport.issues?.warnings || 0} color="text-yellow-500" bg="bg-yellow-500/10" border="border-yellow-500/20" />
                            <IssueItem label="Suggestions" count={selectedReport.issues?.suggestions || 0} color="text-blue-500" bg="bg-blue-500/10" border="border-blue-500/20" />
                        </div>

                        {/* Detailed Issues List */}
                        {selectedReport?.issues?.list?.length > 0 && (
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <h4 className="text-text-secondary text-sm font-semibold mb-3">Detailed Breakdown</h4>
                                {selectedReport.issues.list.map((issue, idx) => {
                                    const severity = issue.severity?.toLowerCase() || 'minor';
                                    const isCritical = severity === 'critical' || severity === 'major';
                                    const isWarning = severity === 'warning' || severity === 'minor';

                                    const styles = isCritical
                                        ? { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', badge: 'border-red-500/30' }
                                        : isWarning
                                            ? { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', badge: 'border-yellow-500/30' }
                                            : { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'border-blue-500/30' };

                                    return (
                                        <div key={idx} className={`p-4 rounded-xl border flex gap-3 ${styles.bg} ${styles.border}`}>
                                            <div className={`mt-1 font-mono text-xs px-1.5 py-0.5 rounded border self-start shrink-0 ${styles.text} ${styles.badge}`}>
                                                Line {issue.line}
                                            </div>
                                            <div>
                                                <p className="text-text-primary text-sm font-medium leading-snug">{issue.message}</p>
                                                <span className="text-xs text-text-secondary capitalize mt-1 block opacity-70">{severity} Issue</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Code Snippet Section */}
                <div className="bg-secondary/50 backdrop-blur border border-border rounded-2xl p-6">
                    <h3 className="text-text-primary font-bold mb-6">Code Snippet</h3>

                    <div className="bg-[#0a1128] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="bg-[#1a2540] px-4 py-3 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <span className="text-xs font-mono text-gray-400 ml-2 uppercase tracking-widest">{selectedReport.language}</span>
                            </div>
                            <Terminal className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="p-6 overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                            <pre className="text-sm font-mono text-gray-100 leading-relaxed selection:bg-accent/30">
                                <code>{selectedReport.snippet}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-secondary/50 backdrop-blur border border-border rounded-2xl p-6">
                    <h3 className="text-text-primary font-bold mb-6">Recommendations</h3>
                    <div className="space-y-3">
                        {selectedReport.recommendations.map((rec, index) => (
                            <div key={index} className="p-4 bg-primary/50 border border-white/5 rounded-xl flex items-start gap-3 hover:border-white/10 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                                    {index + 1}
                                </div>
                                <p className="text-sm text-text-secondary">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

const SkillBar = ({ label, percentage, color }) => (
    <div>
        <div className="flex justify-between mb-2 text-sm font-medium">
            <span className="text-text-secondary">{label}</span>
            <span className="text-text-primary">{percentage}%</span>
        </div>
        <div className="w-full bg-border h-2 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const IssueItem = ({ label, count, color, bg, border }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border ${bg} ${border}`}>
        <span className="text-text-secondary font-medium">{label}</span>
        <span className={`font-bold ${color}`}>{count}</span>
    </div>
);

export default Reports;
