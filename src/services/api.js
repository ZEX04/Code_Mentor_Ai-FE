const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const evaluateCode = async (problemCode, solutionCode, lang) => {
    try {
        const response = await fetch(`${API_BASE_URL}/evaluate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                problem_code: problemCode,
                solution_code: solutionCode,
                lang: lang,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Evaluation failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getReports = async (userId) => {
    try {
        console.log(`[API] Fetching reports for userId: ${userId}`);
        const response = await fetch(`${API_BASE_URL}/reports?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to fetch reports');
        }

        const data = await response.json();
        console.log('[API] Reports fetched:', data);
        return data;
    } catch (error) {
        console.error('API Error (getReports):', error);
        throw error;
    }
};
