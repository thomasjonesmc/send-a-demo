const router = require("express").Router();
const auth = require("../middleware/auth");
const serv = require('../services/user.service');
const demo = require('../services/demo.service');
const respond = require('./respond');

router.post("/register", (req, res) => {
    const user = req.body;
    respond(res, () => serv.createUser(user));
});

router.post("/login", (req, res) => {
    const { loginIdentifier, password } = req.body;
    respond(res, () => serv.loginUser(loginIdentifier, password));
});

router.delete("/delete", auth, (req, res) => {
    respond(res, () => serv.deleteUserById(req.user));
});

router.get("/", auth, (req, res) => {
    respond(res, () => serv.getUserById(req.user));
});

router.get("/:userName", (req, res) => {
    const { userName } = req.params;
    respond(res, () => serv.getUserByUserName(userName));
});

router.get("/search/:search", (req, res) => {
    const { search } = req.params;
    respond(res, () => serv.searchUsers(search));
});

router.get("/:userName/followers", (req, res) => {
    const { userName } = req.params;
    respond(res, () => serv.getUserFollowersByUserName(userName));
});

router.get("/:userName/following", (req, res) => {
    const { userName } = req.params;
    respond(res, () => serv.getUserFollowingByUserName(userName));
});

router.put("/:followerId/follow/:followeeId", (req, res) => {
    const { followerId, followeeId } = req.params;
    respond(res, () => serv.followUser(followerId, followeeId));
});

router.put("/:followerId/unfollow/:followeeId", (req, res) => {
    const { followerId, followeeId } = req.params;
    respond(res, () => serv.unfollowUser(followerId, followeeId));
});

// responds with true if the follower does follow the followee, false otherwise
router.get("/:followerId/follows/:followeeId", (req, res) => {
    const { followerId, followeeId } = req.params;
    respond(res, () => serv.userDoesFollow(followerId, followeeId));
});

router.get("/:userId/demos", (req, res) => {  
    const { userId } = req.params;
    respond(res, () => demo.getPublicUserDemos(userId));
});

module.exports = router;