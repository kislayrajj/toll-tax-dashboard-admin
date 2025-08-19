/**
 * Convert text to uppercase
 * @param {string} text - The text to convert
 * @returns {string} - The text in uppercase
 */
export const toUpperCase = (text) => {
    if (typeof text !== 'string') return text;
    return text.toUpperCase();
};

/**
 * Capitalize the first letter of each word in a string
 * @param {string} text - The text to capitalize
 * @returns {string} - The text with capitalized words
 */
export const capitalizeWords = (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/\b\w/g, char => char.toUpperCase());
};