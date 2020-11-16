const router = require("express").Router();
const { JsonWebTokenError } = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Demo = require("../models/demoModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

router.post("/new-demo", async (req, res) => {
  try {
    let { userId, demoTitle, displayName } = req.body;

    let demoPath = `${displayName}/`;
    let createdOn = new Date();
    let modifiedOn = new Date();
    let tracks = [];

    //validating input

    if (!demoTitle || !userId)
      return res.status(400).json({
        msg: "Please select a title for your demo before submitting!",
      });

    const newDemo = new Demo({
      userId,
      demoTitle,
      displayName,
      demoPath,
      createdOn,
      modifiedOn,
      tracks,
    });

    newDemo.demoPath += `${newDemo._id}`;

    const savedDemo = await newDemo.save();
    res.json(savedDemo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-demo-by-id", async (req, res) => {
  try {
    const demo = await Demo.findOne({ _id: req.query.id }).populate({
      path: "tracks",
      model: Track,
    });

    await demo.populate({ path: "tracks", model: Track });

    res.json(demo);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

router.get("/get-demo-list", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    userDemos = await Demo.find({ displayName: user.displayName }).sort({
      modifiedOn: "desc",
    });
    res.json(userDemos);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

router.post("/new-track/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const trackAuthor = user.displayName;

    let { trackTitle, trackPath } = req.body;

    const newTrack = new Track({
      trackTitle,
      trackPath,
      trackAuthor,
    });

    newTrack.trackPath += `/${newTrack._id}`;

    Track.create(newTrack);

    return Demo.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { tracks: newTrack._id } },
      { new: true }
    )
      .then((demo) => {
        res.json(demo);
        console.log(demo);
      })
      .catch((err) => {
        res.status(400);
      });
    // const savedTrack = await newTrack.save();
    //
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete-track", auth, async (req, res) => {
  try {
    await Track.findByIdAndDelete(req.body).catch((err) => {
      res.status(400).json({ error: err.message });
    });

    Demo.findOneAndUpdate(
      { tracks: req.body._id },
      { $pull: { tracks: req.body._id } },
      { new: true }
    )
      .then((demo) => {
        res.json(demo);
        console.log(demo);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
  } catch (err) {
    res.status(500).status.json({ error: err.message });
  }
});

module.exports = router;
