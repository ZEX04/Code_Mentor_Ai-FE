import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import { evaluateCode } from '../../services/api';
import { formatReportData } from '../../utils/reportUtils';
import { Upload, Play, Loader2, AlertCircle } from 'lucide-react';

const Submit = () => {
    const [problemCode, setProblemCode] = useState('');
    const [solutionCode, setSolutionCode] = useState('');
    const [lang, setLang] = useState('');
    // NEW: isAnalyzing state for loading
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!problemCode.trim() || !solutionCode.trim() || !lang) {
            setError('Please fill in all fields');
            return;
        }

        // NEW: Set loading state
        setIsAnalyzing(true);

        try {
            console.log("Submitting code for evaluation..."); // Debug Log

            // 1. Direct API Call (No DB Fetch)
            const analysisResult = await evaluateCode(problemCode, solutionCode, lang);
            console.log("Submit: Raw API Response:", analysisResult);
            console.log("Submit: API Response Keys:", Object.keys(analysisResult));

            // 2. Navigate with State IMMEDIATELY
            console.log("Submit: Navigating to /dashboard/reports with data...");
            navigate('/dashboard/reports', { state: { data: analysisResult } });

        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || 'An error occurred during analysis');
            setIsAnalyzing(false); // Only stop loading on error, otherwise we navigate away
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Submit Code</h1>
            <p className="text-text-secondary mb-8">Get instant AI feedback on your code.</p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Language Selection */}
                <div className="space-y-2">
                    <label className="text-text-primary font-medium">Programming Language</label>
                    <select
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="w-full p-3 rounded-xl bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent"
                    >
                        <option value="">Select a language</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>

                {/* Problem Code */}
                <div className="space-y-2">
                    <label className="text-text-primary font-medium">Problem Statement / Code</label>
                    <textarea
                        value={problemCode}
                        onChange={(e) => setProblemCode(e.target.value)}
                        placeholder="// Paste the problem description or initial code here..."
                        className="w-full h-40 p-4 rounded-xl bg-secondary border border-border text-text-primary font-mono text-sm focus:outline-none focus:border-accent resize-none"
                    />
                </div>

                {/* Solution Code */}
                <div className="space-y-2">
                    <label className="text-text-primary font-medium">Your Solution</label>
                    <textarea
                        value={solutionCode}
                        onChange={(e) => setSolutionCode(e.target.value)}
                        placeholder="// Paste your solution code here..."
                        className="w-full h-60 p-4 rounded-xl bg-secondary border border-border text-text-primary font-mono text-sm focus:outline-none focus:border-accent resize-none"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Play className="w-6 h-6 fill-current" />
                            Analyze Code
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Submit;
