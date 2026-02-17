import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { formatReportData } from '../utils/reportUtils';

const ReportContext = createContext();

export const useReports = () => useContext(ReportContext);

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize reports based on auth state changes
    useEffect(() => {
        let mounted = true;

        const fetchAnalysis = async (userId) => {
            if (!mounted) return;
            setIsLoading(true);
            try {
                // Wait 1 minute as requested to handle potential race conditions/backend delays
                console.log("[ReportContext] Waiting 1 minute before fetching...");
                await new Promise(resolve => setTimeout(resolve, 60000));

                if (!mounted) return;
                console.log("[ReportContext] Fetching reports for User ID:", userId);

                const { data, error } = await supabase
                    .from('code_submit')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (mounted) {
                    if (data && data.length > 0) {
                        console.log("[ReportContext] Raw Supabase Data:", data);
                        const formattedReports = data.map(item => formatReportData(item));
                        setReports(formattedReports);
                    } else {
                        console.log("[ReportContext] No reports found for user");
                        setReports([]);
                    }
                }
            } catch (error) {
                console.error("[ReportContext] Error fetching reports:", error);
                if (mounted) setReports([]);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        // 1. Check active session immediately on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                if (session?.user) {
                    console.log("[ReportContext] Initial session found:", session.user.id);
                    fetchAnalysis(session.user.id);
                } else {
                    console.log("[ReportContext] No initial session found via getSession");
                    setIsLoading(false);
                }
            }
        });

        // 2. Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("[ReportContext] Auth state changed:", _event, session?.user?.id);
            if (session?.user) {
                fetchAnalysis(session.user.id);
            } else {
                if (mounted) {
                    setReports([]);
                    setIsLoading(false);
                }
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Add new report (Optimistic or Refetch)
    const addReport = async (newReport) => {
        // Since we are now fetching from DB, ideally we should just refetch or add to state.
        // For now, we'll just update local state to reflect the new report immediately.
        // NOTE: The actual saving to DB happens in the Submit flow, so we assume it's there.
        setReports((prev) => [newReport, ...prev]);
    };

    const getReportById = (id) => reports.find(r => r.id === id);

    return (
        <ReportContext.Provider value={{ reports, addReport, getReportById, isLoading }}>
            {children}
        </ReportContext.Provider>
    );
};
