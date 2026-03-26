import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatReportData } from '../utils/reportUtils';
import { useAuth } from './AuthContext';

const ReportContext = createContext();

export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Default false, only true on explicit fetch

    // Fetch reports function (exposed for silent sync)
    const fetchAnalysis = async (userId) => {
        setIsLoading(true);
        try {
            console.log("[ReportContext] Fetching reports for User ID:", userId);

            const { data, error } = await supabase
                .from('code_submit')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                console.log("[ReportContext] Raw Supabase Data:", data);
                const formattedReports = data.map(item => formatReportData(item));
                setReports(formattedReports);
            } else {
                console.log("[ReportContext] No reports found for user");
                setReports([]);
            }
        } catch (error) {
            console.error("[ReportContext] Error fetching reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize reports based on auth state changes
    useEffect(() => {
        let mounted = true;

        if (user) {
            // Only fetch if we don't already have reports (e.g., initial load)
            if (reports.length === 0) {
                console.log("[ReportContext] Auth user found, fetching initial reports:", user.id);
                fetchAnalysis(user.id);
            } else {
                console.log("[ReportContext] Reports already exist, skipping initial fetch.");
            }
        } else {
            if (mounted) {
                console.log("[ReportContext] No user found, clearing reports.");
                setReports([]);
                setIsLoading(false);
            }
        }

        return () => {
            mounted = false;
        };
    }, [user]); // We keep `user` as dependency but the `reports.length === 0` prevents endless loops

    // Add new report with DB Persistence
    const addReport = useCallback(async (newReportData) => {
        // 1. Optimistic Update or Update Existing (Immediate UI feedback)
        const hasDbId = typeof newReportData.id === 'string' && newReportData.id.includes('-');
        const optimisticId = hasDbId ? newReportData.id : Date.now();
        const optimisticData = { ...newReportData, id: optimisticId };
        const formattedReport = formatReportData(optimisticData);

        console.log("[ReportContext] Optimistically adding/updating report:", formattedReport);
        setReports((prev) => {
            const exists = prev.some(r => r.id === optimisticId);
            if (exists) {
                return prev.map(r => r.id === optimisticId ? formattedReport : r);
            }
            return [formattedReport, ...prev];
        });

        // 2. Persist to DB (Background)
        let finalReport = formattedReport;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                console.warn("[ReportContext] User not logged in, cannot save to DB");
                return finalReport;
            }

            const payload = {
                user_id: session.user.id,
                lang: newReportData.lang || 'javascript',
                problem_code: newReportData.submitted_problem || newReportData.problem_code || newReportData.problem,
                solution_code: newReportData.submitted_solution || newReportData.solution_code || newReportData.code,
                corrected_code: newReportData.corrected_code || newReportData.ai_code || newReportData.suggested_solution,
                diff_view: newReportData.diff_view || newReportData.corrected_code,
                suggested_solution: newReportData.suggested_solution || newReportData.corrected_code || newReportData.ai_code
            };

            // Remove undefined properties to prevent Supabase errors
            Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

            console.log("[ReportContext] Persisting to DB with payload:", payload);

            let insertedData, error;
            if (hasDbId) {
                // Update the existing row created by the Edge Function
                const res = await supabase
                    .from('code_submit')
                    .update(payload)
                    .eq('id', optimisticId)
                    .select()
                    .single();
                insertedData = res.data;
                error = res.error;
            } else {
                // Insert a new row
                const res = await supabase
                    .from('code_submit')
                    .insert([payload])
                    .select()
                    .single();
                insertedData = res.data;
                error = res.error;
            }

            if (error) {
                console.error("[ReportContext] DB Persist Error:", error);
            } else if (insertedData) {
                console.log("[ReportContext] DB Persist Success, real ID:", insertedData.id);
                // 3. Replace the optimistic report with the real one from DB (with correct UUID)
                finalReport = formatReportData(insertedData);
                setReports(prev => prev.map(r => r.id === optimisticId ? finalReport : r));
            }
        } catch (err) {
            console.error("[ReportContext] Persistence Failed:", err);
        }

        return finalReport;
    }, []);

    // Refresh function for Silent Sync
    const refreshReports = useCallback(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            console.log("[ReportContext] Silent Refresh triggered");

            const { data, error } = await supabase
                .from('code_submit')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                const formattedReports = data.map(item => formatReportData(item));
                setReports(formattedReports);
            }
        }
    }, []);

    const getReportById = useCallback((id) => reports.find(r => r.id === id), [reports]);

    return (
        <ReportContext.Provider value={{ reports, addReport, getReportById, isLoading, refreshReports }}>
            {children}
        </ReportContext.Provider>
    );
};
