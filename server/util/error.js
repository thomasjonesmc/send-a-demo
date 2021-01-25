module.exports = (message, code) => {
    const error = new Error(message);
    error.status = code || 500;
    throw error;
}