const s3 = require('../s3');
const router = require("express").Router();

router.post('/signed-url', async (req, res) => {

  const { fileName, fileType } = req.body;

  const response = await s3.getSignedUrl(fileName, fileType);

  res.json(response);
});

module.exports = router;