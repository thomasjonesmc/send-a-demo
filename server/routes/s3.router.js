const serv = require('../services/s3.service');
const respond = require('./respond');
const router = require("express").Router();

router.post('/signed-url', (req, res) => {
    const { fileName, fileType } = req.body;
    respond(res, () => serv.getSignedUrl(fileName, fileType));
});

module.exports = router;