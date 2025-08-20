// API Configuration
const API_CONFIG = {
  // BASE_URL: "https://toll-tax-server.onrender.com/api",
  // BASE_URL: "http://localhost:8000/api",
  BASE_URL: "https://toll-tax-server.onrender.com/api",
};

/**
 * A centralized place for API mutation functions (POST, PATCH, DELETE).
 * This keeps API logic separate from component logic.
 */
export const apiService = {
  /**
   * Performs a POST request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {object} body - The request body.
   * @returns {Promise<object>} - The JSON response.
   */
  post: async (endpoint, body) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        } catch (e) {
            // If parsing JSON fails, throw a generic error with status text
            if (e instanceof SyntaxError) {
                throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
            }
            // Re-throw if it's not a JSON parsing error
            throw e;
        }
    }
    return response.json();
  },

  /**
   * Performs a PATCH request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @param {object} body - The request body.
   * @returns {Promise<object>} - The JSON response.
   */
  patch: async (endpoint, body) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        } catch (e) {
            // If parsing JSON fails, throw a generic error with status text
            if (e instanceof SyntaxError) {
                throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
            }
            // Re-throw if it's not a JSON parsing error
            throw e;
        }
    }
    return response.json();
  },

  /**
   * Performs a DELETE request to the specified endpoint.
   * @param {string} endpoint - The API endpoint.
   * @returns {Promise<object>} - The JSON response.
   */
  delete: async (endpoint) => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
        } catch (e) {
            // If parsing JSON fails, throw a generic error with status text
            if (e instanceof SyntaxError) {
                throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
            }
            // Re-throw if it's not a JSON parsing error
            throw e;
        }
    }
    return response.json();
  },
};