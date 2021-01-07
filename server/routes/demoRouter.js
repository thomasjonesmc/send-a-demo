const router = require("express").Router();
const auth = require("../middleware/auth");
const Demo = require("../models/demoModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const s3 = require("../s3");

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

router.get("/get-demo-list", auth, async (req, res) => {
  let featuredDemos = [];
  try {
    const user = await User.findById(req.user);
    userDemos = await Demo.find({ displayName: user.displayName }).sort({
      modifiedOn: "desc",
    });
    featuredTracks = await Track.find({ trackAuthor: user.displayName });

    for (let track of Object.entries(featuredTracks)) {
      let featuredDemo = await Demo.findOne({
        tracks: track[1]._id,
        displayName: { $ne: track[1].trackAuthor },
      });

      if (featuredDemo !== null) {
        featuredDemos.push(featuredDemo);
      }
    }
    if (featuredDemos !== null) {
      let uniqueFeaturedDemos = featuredDemos.filter(function ({ _id }) {
        return !this[_id] && (this[_id] = _id);
      }, {});

      userDemos = [...userDemos, ...uniqueFeaturedDemos];
    }

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

    console.log("TRACK PATH: ", trackPath);

    let trackTitle = req.body.trackTitle;
    let trackAuthor = req.body.trackAuthor;

    const newTrack = new Track({
      trackTitle,
      trackPath,
      trackAuthor,
    });

    newTrack.trackPath += `/${newTrack._id}`;

    console.log("NEW TRACK: ", newTrack);

    const saveTrack = async () => {
      await newTrack.save((err) => {
        if (err)
          return res
            .status(400)
            .json({ error: `error on saving track : ${err.message}` });
      });
    };

    saveTrack();
    // Track.create(newTrack);

    return Demo.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { tracks: newTrack._id } },
      { new: true }
    )
      .then((demo) => {
        res.json(demo);
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });
    //const savedTrack = await newTrack.save();
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

// TODO: add auth middleware back
router.delete("/:demoId/track/:trackId", async (req, res) => {
  try {

    const { demoId, trackId } = req.params;

    console.log(req.params);
    
    await Track.findByIdAndDelete(req.body);

    const demo = Demo.findOneAndUpdate(
      { tracks: req.body._id },
      { $pull: { tracks: req.body._id } },
      { new: true }
    );

    await s3.deleteFile(`${demoId}/${trackId}`);
     
    res.json(demo);

  } catch (err) {
    res.status(500).status.json({ error: err.message });
  }
});

module.exports = router;
