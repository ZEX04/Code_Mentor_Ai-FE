export const fetchWithRetry = async (url, options = {}, retries = 0, backoff = 2000) => {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url, options);

            // If the response is successful, or it's a client error (except 429 Too Many Requests), return it.
            // We usually only want to retry on 5xx server errors or 429 rate limits.
            if (response.ok || (response.status < 500 && response.status !== 429)) {
                return response;
            }

            // If it's the last retry, throw an error or return the failed response
            if (i === retries) {
                return response;
            }

        } catch (error) {
            // Network error (e.g., DNS resolution failed)
            if (i === retries) {
                throw error;
            }
        }

        // Wait before retrying (Exponential backoff)
        // Attempt 1: 2000ms
        // Attempt 2: 4000ms
        // Attempt 3: 8000ms
        const delay = backoff * Math.pow(2, i);
        console.warn(`Request failed. Retrying in ${delay / 1000} seconds... (Attempt ${i + 1} of ${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
};
