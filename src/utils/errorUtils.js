/**
 * Format error messages for better user experience
 * @param {Error} error - The error object
 * @returns {string} - Formatted error message
 */
export const formatErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message || error.toString();
    
    // Handle specific MongoDB/Mongoose errors
    if (message.includes('Cannot populate path') && message.includes('ownerVehicle')) {
        return 'Server configuration error: Backend needs to set strictPopulate option to false. Contact system administrator.';
    }
    
    // Handle generic network/HTTP errors
    if (message.includes('HTTP error') || message.includes('API request failed')) {
        return 'Unable to connect to server. Please check your connection and try again.';
    }
    
    // Return original message if no specific formatting is needed
    return message;
};