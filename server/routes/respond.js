module.exports = async (res, responseFunction) => {
    try {
        const response = await responseFunction();
        res.json(response);
    } catch (err) {

        console.log('ERROR', err.message);

        if (err.status) {
            res.status(err.status).json({ error: err.message });
        } else {
            res.status(500).json({error: 'Unknown Error Occurred'});
        }
    }
}