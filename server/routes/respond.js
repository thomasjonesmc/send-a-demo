module.exports = async (res, responseFunction) => {
    try {
        const response = await responseFunction();
        res.json(response);
    } catch (err) {
        console.log('ERROR', err.message);

        // if the error had a status, we know it was an error we created
        // if we created the error, we know we can comfortably show the user
        // if we didn't create the error, we can't be sure what the message is, so we mask it from the user
        if (err.status) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({error: 'Unknown Error Occurred'});
        }
    }
}