const router = require("express").Router();
const auth = require("../middleware/auth");
const Demo = require("../models/demoModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const s3 = require("../s3");
const { ObjectId } = require('mongoose').Types;

router.get("/get-demo-list", auth, async (req, res) => {

  try {

    const userId = req.user;

    const userDemos = await Demo.aggregate([
      // only get demos where the user is a creator or contributor
      { 
        $match: {
          $or : [
            { creatorId: ObjectId(userId) },
            { contributors: ObjectId(userId) }
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

router.get("/:id", async (req, res) => {

  try {
    demo = await Demo.findOne({ _id: req.params.id }).populate({
      path: "tracks",
      model: Track,
    });

    res.json(demo);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.post("/new-demo", async (req, res) => {
  try {
    let { creatorId, title } = req.body;

    //validating input
    if (!title || !creatorId) {
      return res.status(400).json({
        msg: "Please select a title for your demo before submitting!",
      });
    }

    const demo = await new Demo({ creatorId, title }).save();

    res.json(demo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/new-track", async (req, res) => {
  try {
    const trackPath = req.params.id;
    const { trackTitle, trackAuthor } = req.body;


    const newTrack = new Track({
      trackTitle,
      trackPath,
      trackAuthor,
    });

    newTrack.trackPath += `/${newTrack._id}`;

    const returnTrack = await newTrack.save();

    await Demo.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { tracks: newTrack._id } },
      { new: true }
    );
  
    res.json(returnTrack);
 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add-signed-url", auth, async (req, res) => {
  try {
    const { trackId, url } = req.body;
    const track = await Track.findByIdAndUpdate(trackId, { trackSignedURL: url })
    res.json(track);
  } catch (err) {
    res.json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDemo = await Demo.findByIdAndDelete(id);
    res.json(deletedDemo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:demoId/tracks/:trackId", auth, async (req, res) => {
  try {

    const { demoId, trackId } = req.params;
    
    const track = await Track.findByIdAndDelete(trackId);

    Demo.findOneAndUpdate(
      { tracks: trackId },
      { $pull: { tracks: trackId } },
      { new: true }
    );

    await s3.deleteFile(`${demoId}/${trackId}`);
     
    res.json(track);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:demoId/tracks/:trackId/audio', async (req, res) => {
  try{
    const { demoId, trackId } = req.params;
  
    await s3.deleteFile(`${demoId}/${trackId}`);
  
    const changedTrack = await Track.findByIdAndUpdate(
      trackId, { trackSignedURL: null }
    );

    res.json({ ...changedTrack.toObject(), trackSignedURL: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
