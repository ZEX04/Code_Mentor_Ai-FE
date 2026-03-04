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
        // 1. Optimistic Update (Immediate UI feedback)
        const tempId = Date.now();
        const optimisticData = { ...newReportData, id: tempId };
        const formattedReport = formatReportData(optimisticData);
        console.log("[ReportContext] Optimistically adding report:", formattedReport);
        setReports((prev) => [formattedReport, ...prev]);

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
                ...newReportData,
                lang: newReportData.lang || 'javascript',
            };

            delete payload.id;
            delete payload.created_at;

            console.log("[ReportContext] Persisting to DB:", payload);
            const { data: insertedData, error } = await supabase
                .from('code_submit')
                .insert([payload])
                .select()
                .single();

            if (error) {
                console.error("[ReportContext] DB Insert Error:", error);
            } else if (insertedData) {
                console.log("[ReportContext] DB Insert Success, real ID:", insertedData.id);
                // 3. Replace the optimistic report with the real one from DB (with correct UUID)
                finalReport = formatReportData(insertedData);
                setReports(prev => prev.map(r => r.id === tempId ? finalReport : r));
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
