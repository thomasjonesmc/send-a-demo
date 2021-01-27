// custom error function
// we use this to check if our errors have a status
// if an error has a status property, we know WE created it
// if it doesn't have a status is an an unknown/unexpected error and we may need to react differently
module.exports = (message, code) => {
    const error = new Error(message);
    error.status = code || 500;
    throw error;
}