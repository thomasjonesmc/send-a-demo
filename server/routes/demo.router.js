const router = require("express").Router();
const auth = require("../middleware/auth");
const serv = require('../services/demo.service');
const respond = require('./respond');

router.get("/get-demo-list", auth, (req, res) => {
    const userId = req.user;
    respond(res, () => serv.getPersonalUserDemos(userId));
});

router.get("/:demoId", (req, res) => {
    const { demoId } = req.params;
    respond(res, () => serv.getDemoById(demoId));
});

router.post("/new-demo", (req, res) => {
    let { creatorId, title } = req.body;
    respond(res, () => serv.createDemo(creatorId, title));
});

router.post("/:demoId/new-track", (req, res) => {
    const { demoId } = req.params;
    const { trackTitle, trackAuthor } = req.body;
    respond(res, () => serv.addTrackToDemo(demoId, trackTitle, trackAuthor));
});

router.post("/add-signed-url", auth, (req, res) => {
    const { trackId, url } = req.body;
    respond(res, () => serv.updateTrackUrl(trackId, url));
});

router.post("/modify-track-start-time", (req, res) => {
    const { trackId, startTime } = req.body;
    respond(res, () => serv.modifyTrackStartTime(trackId, startTime));
});

router.put("/:demoId/addContributor/:userId", (req, res) => {
    const { demoId, userId } = req.params;
    respond(res, () => serv.addUserToDemo(demoId, userId));
});

router.delete("/:demoId", (req, res) => {
    const { demoId } = req.params;
    respond(res, () => serv.deleteDemoById(demoId));
});

router.delete("/:demoId/tracks/:trackId", auth, (req, res) => {
    const { demoId, trackId } = req.params;
    respond(res, () => serv.deleteTrack(demoId, trackId));
});

router.delete('/:demoId/tracks/:trackId/audio', (req, res) => {
    const { demoId, trackId } = req.params;
    respond(res, () => serv.deleteTrackAudio(demoId, trackId));
});

module.exports = router;