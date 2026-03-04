import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '../../context/ReportContext';
import { useAuth } from '../../context/AuthContext';
import { Upload, Play, Loader2, AlertCircle } from 'lucide-react';
import { fetchWithRetry } from '../../utils/apiRetry';

const Submit = () => {
    const { session } = useAuth();
    const [problemCode, setProblemCode] = useState('');
    const [solutionCode, setSolutionCode] = useState('');
    const [lang, setLang] = useState('');
    // NEW: isLoading state to manage submission process
    const [isLoading, setIsLoading] = useState(false);
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

        if (!session) {
            setError('You must be logged in to submit.');
            return;
        }

        // NEW: Set loading state
        setIsLoading(true);

        try {
            console.log("Submitting code to AI Mentor Edge Function...");

            const response = await fetchWithRetry('https://rqqdmxvhhrxdghnhefmp.supabase.co/functions/v1/code_submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    problem_code: problemCode,
                    solution_code: solutionCode,
                    lang: lang
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || 'Submission failed');
            }

            const analysisResult = await response.json().catch(() => null);
            console.log("Submit: Edge Function Response:", analysisResult);

            // 2. Append submitted data
            const enhancedResult = {
                ...analysisResult,
                submitted_problem: problemCode,
                submitted_solution: solutionCode,
                lang: lang
            };

            // 3. Navigate with State IMMEDIATELY
            console.log("Submit: Navigating to /dashboard/reports with data...");
            navigate('/dashboard/reports', { state: { data: enhancedResult } });

        } catch (err) {
            console.error("Submission error:", err);
            setError(err.message || 'An error occurred during analysis');
        } finally {
            setIsLoading(false); // Stop loading when complete
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
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isLoading ? (
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
