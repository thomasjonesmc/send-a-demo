const router = require("express").Router();
const auth = require("../middleware/auth");
const Demo = require("../models/demoModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const s3 = require("../s3");
const { ObjectId } = require('mongoose').Types;

router.post("/new-demo", async (req, res) => {
  try {
    let { creatorId, title } = req.body;

    console.log(creatorId, title);

    //validating input
    if (!title || !creatorId) {
      return res.status(400).json({
        msg: "Please select a title for your demo before submitting!",
      });
    }

    const demo = await new Demo({ creatorId, title }).save();

    res.json(demo);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

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

router.delete("/delete-demo", async (req, res) => {
  try {
    const deletedDemo = await Demo.findByIdAndDelete(req.body);
    res.json(deletedDemo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/new-track/:id", async (req, res) => {
  try {
    const trackPath = req.params.id;

    let trackTitle = req.body.trackTitle;
    let trackAuthor = req.body.trackAuthor;

    const newTrack = new Track({
      trackTitle,
      trackPath,
      trackAuthor,
    });

    newTrack.trackPath += `/${newTrack._id}`;

    const returnTrack = await newTrack.save();

    return Demo.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { tracks: newTrack._id } },
      { new: true }
    )
      .then((demo) => {
        res.json(returnTrack);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/add-signed-URL", auth, async (req, res) => {
  try {
    Track.findByIdAndUpdate(
      req.body._id,
      {
        trackSignedURL: req.body.URL,
      },
      (err, data) => {
        if (err) {
          res.json(err);
        } else {
          res.json(data);
        }
      }
    );
  } catch (err) {
    res.json(err);
  }
});

router.post("/remove-s3-url", auth, async (req, res) => {
  try {
    Track.findByIdAndUpdate(
      req.body._id,
      {
        trackSignedURL: null,
      },
      (err, data) => {
        if (err) {
          res.json(err);
        } else {
          res.json(data);
        }
      }
    );
  } catch (err) {
    res.json(err);
  }
});

router.delete("/:demoId/tracks/:trackId", auth, async (req, res) => {
  try {

    const { demoId, trackId } = req.params;

    console.log(req.params);
    
    const track = await Track.findByIdAndDelete(trackId);

    console.log('DELETED TRACK', track);

    const demo = Demo.findOneAndUpdate(
      { tracks: trackId },
      { $pull: { tracks: trackId } },
      { new: true }
    );

    console.log('UPDATED DEMO', demo);

    const deletedS3 = await s3.deleteFile(`${demoId}/${trackId}`);

    console.log('DELETED S3', deletedS3);
     
    res.json(demo);

  } catch (err) {
    console.log('ERROR MESSAGE', err.message);
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
    console.log('ERROR', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
