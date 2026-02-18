import { Zap, FileCode, Activity, Code, Terminal } from 'lucide-react';

export const formatReportData = (apiResponse) => {
    // 1. Generate ID
    const id = apiResponse.id || Date.now();

    // 2. Format Date (FIXED: Use DB date if available) 🛠️
    const dateObj = apiResponse.created_at ? new Date(apiResponse.created_at) : new Date();
    const date = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // 3. Status & Color Logic
    let status = 'Good';
    let color = 'from-blue-500 to-cyan-500';
    let icon = Code;
    // تأكدنا إن الاسم ده مطابق لعمود الداتابيز
    const score = apiResponse.over_all_score || 0;

    if (score >= 90) {
        status = 'Excellent';
        color = 'from-green-500 to-emerald-500';
        icon = Zap;
    } else if (score >= 75) {
        status = 'Great';
        color = 'from-blue-500 to-cyan-500';
        icon = Activity;
    } else if (score >= 60) {
        status = 'Good';
        color = 'from-purple-500 to-pink-500';
        icon = FileCode;
    } else {
        status = 'Needs Improvement';
        color = 'from-orange-500 to-red-500';
        icon = Terminal;
    }

    return {
        id: id,
        // هنا ربطنا الأعمدة بذكاء
        language: apiResponse.lang || 'Unknown',
        title: apiResponse.title || 'Code Analysis',
        sub_title: apiResponse.sub_title || '',
        date: date,
        score: score,
        status: status,
        color: color,
        icon: icon, // React Component
        iconName: icon === Zap ? 'Zap' : icon === Activity ? 'Activity' : icon === FileCode ? 'FileCode' : 'Terminal', // String Name

        // Mapped Metrics (User requested specifically 'metrics' with camelCase)
        metrics: {
            readability: apiResponse.readability || 0,
            maintainability: apiResponse.maintainability || 0,
            efficiency: apiResponse.efficiency || 0,

            // Explicit mapping for new fields with fallbacks
            problemSolving: apiResponse.problem_solving || apiResponse.problemSolving || 0,
            edgeCases: apiResponse.edge_cases_handling || apiResponse.edge_cases || apiResponse.edgeCases || 0,
            correctness: apiResponse.correctness || 0
        },

        // Keep 'quality' for backward compatibility if needed, or just rely on metrics. 
        // We'll update UI to use 'metrics'.

        issues: {
            critical: apiResponse.critical || 0,
            warnings: apiResponse.warning || 0,
            suggestions: apiResponse.suggestions || 0,
            list: (apiResponse.issues || []).map(issue => ({
                line: issue.line,
                severity: issue.severity,
                message: issue.message
            }))
        },
        snippet: apiResponse.problem || '', // Original code
        suggested_solution: apiResponse.ai_code || '',
        diff_view: apiResponse.corrected_code || '',
        recommendations: apiResponse.recommendations || [],
        search_topics: apiResponse.search_topics || []
    };

    console.log("FormatReportData: Mapped Metrics:", result.metrics);
    return result;
};

export const getIconByName = (name) => {
    switch (name) {
        case 'Zap': return Zap;
        case 'Activity': return Activity;
        case 'FileCode': return FileCode;
        case 'Terminal': return Terminal;
        default: return Code;
    }
};