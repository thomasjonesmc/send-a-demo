const router = require("express").Router();
const auth = require("../middleware/auth");
const { ObjectId } = require('mongoose').Types;

const serv = require('../services/user.service');
const respond = require('./respond');

router.post("/register", async (req, res) => {
    const user = req.body;
    respond(res, () => serv.createUser(user));
});

router.post("/login", async (req, res) => {
    // email will be updated to something like `loginIdentifier` to accomodate email OR username in future
    const { email, password } = req.body;
    respond(res, () => serv.loginUser(email, password));
});

router.delete("/delete", auth, async (req, res) => {
    respond(res, () => serv.deleteUserById(req.user));
});

router.get("/", auth, async (req, res) => {
    respond(res, () => serv.getUserById(req.user));
});

router.get("/:userName", async (req, res) => {
    const { userName } = req.params;
    respond(res, () => serv.getUserByUserName(userName));
});

router.get("/:userName/followers", async (req, res) => {
    const { userName } = req.params;
    respond(res, () => serv.getUserFollowersByUserName(userName));
});

router.get("/:userName/following", async (req, res) => {
    const { userName } = req.params;
    respond(res, () => serv.getUserFollowingByUserName(userName));
});

router.put("/:followerId/follow/:followeeId", async (req, res) => {
    const { followerId, followeeId } = req.params;
    respond(res, () => serv.followUser(followerId, followeeId));
});

router.put("/:followerId/unfollow/:followeeId", async (req, res) => {
    const { followerId, followeeId } = req.params;
    respond(res, () => serv.unfollowUser(followerId, followeeId));
});

// responds with true if the follower does follow the followee, false otherwise
router.get("/:followerId/follows/:followeeId", async (req, res) => {
    const { followerId, followeeId } = req.params;
    respond(res, () => serv.userDoesFollow(followerId, followeeId));
});


// THIS IS A STRAIGHT COPY PAST OF `/demos/get-demo-list` with only the $match changed
// when we refatcor the routes into more layers of logic, this should become a reusable function
router.get("/:userId/demos", async (req, res) => {

  try {    
    const { userId } = req.params;

    const userDemos = await Demo.aggregate([
      // only get demos where the user is the creator and 
      { 
        $match: {
          $and: [
            { creatorId: ObjectId(userId) },
            { isPublic: true }
          ]
        }
      },
      // get the User document that the creator Id refers to
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator"
        }
      },
      // move that creator document out of an array and into the userDemo we return
      {
        $unwind: "$creator"
      },
      // convert all the track ids in the tracks array to track objects, notice the "as" has the same name as the existing "tracks" array, so it overwrites it
      {
        $lookup: {
          from: "tracks",
          localField: "tracks",
          foreignField: "_id",
          as: "tracks"
        }
      }, 
      // converts all user ids in the "contributors" array to user objects, also overwrites existing users array
      {
        $lookup: {
          from: "users",
          localField: "contributors",
          foreignField: "_id",
          as: "contributors"
        }
      },
      // ignore the passwords and the creatorId since the creatorId gets stored in the creator object
      {
        $project: {
          "contributors.password": 0,
          "creator.password": 0,
          "creatorId": 0
        }
      }
    ]);

    res.json(userDemos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;