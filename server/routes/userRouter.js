const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");
const { ObjectId } = require('mongoose').Types;

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName, userName } = req.body;

    //validate request
    if (!email || !password || !passwordCheck || !displayName || !userName)
      return res.status(400).json({ msg: "Please populate all fields." });
    if (password.length < 5)
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters" });
    if (password !== passwordCheck)
      return res.status(400).json({ error: "Password fields must match!" });

    // const existingUserName = await User.findOne({
    //   userName: userName,
    // });
    // if (existingUserName)
    //   return res.status(400).json({
    //     error: "An account with this username is already registered.",
    //   });

    // const existingUser = await User.findOne({ email: email });
    // if (existingUser)
    //   return res.status(400).json({
    //     error: "An account with this email is already registered.",
    //   });

    //hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
      userName
    });

    const savedUser = await newUser.save();

    // shorten name to use properties
    const u  = savedUser.toObject();

    res.json({
      followers : u.followers.length, 
      following : u.following.length, 
      _id : u._id, 
      email : u.email, 
      userName : u.userName, 
      displayName : u.displayName 
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate
    if (!email || !password)
      return res.status(400).json({ error: "Not all fields have been entered." });

    const foundUser = await User.findOne({ email: email }, { __v: 0 });
    const { password: foundPassword, ...user} = foundUser.toObject();

    if (!user)
      return res
        .status(400)
        .json({ error: "No account with this email has been found." });

    const isMatch = await bcrypt.compare(password, foundPassword);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token, 
      user: {
        ...user,
        followers: user.followers.length, 
        following: user.following.length
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  
  try {
    const token = req.header("x-auth-token");
    
    const isValid = await tokenIsValid(token);
    
    if (!isValid) throw new Error("Invalid token");
    
    const foundUser = await User.findById(req.user, { __v: 0, password: 0 });

    const user = foundUser.toObject();

    // return the user with their number of followers
    res.json({
      ...user, 
      followers: user.followers.length, 
      following: user.following.length
    });
    

  } catch (err) {
    res.status(500).json({ error: err.message});
  }

});

router.get("/:userName", async (req, res) => {
  
  try {
    const { userName } = req.params;

    const foundUser = await User.findOne({ userName }, { __v: 0, password: 0 }).collation({locale: "en", strength: 2});

    if (!foundUser) throw new Error(`No user found with username ${userName}`);

    const user = foundUser.toObject();

    // return the user with their number of followers
    res.json({
      ...user, 
      followers: user.followers.length, 
      following: user.following.length
    });

  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

router.get("/:userName/followers", async (req, res) => {
  
  try {
    const { userName } = req.params;
    const user = await getFollows("followers", userName);

    if (!user) throw new Error(`No user found with username ${userName}`);

    res.json(user);
  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

router.get("/:userName/following", async (req, res) => {
  
  try {
    const { userName } = req.params;
    const user = await getFollows("following", userName);

    if (!user) throw new Error(`No user found with username ${userName}`);

    res.json(user);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.put("/:followerId/follow/:followeeId", async (req, res) => {
  try {
    const { followerId, followeeId } = req.params;

    const updatedFollower = await User.findOneAndUpdate(
      { _id: ObjectId(followerId) },
      { $push: { following: ObjectId(followeeId) } },
      {
        fields: { __v: 0, password: 0 },
        new: true
      }
    );

    const updatedFollowee = await User.findOneAndUpdate(
      { _id: ObjectId(followeeId) },
      { $push: { followers: ObjectId(followerId) } },
      {
        fields: { __v: 0, password: 0 },
        new: true
      }
    );

    const follower = updatedFollower.toObject();
    const followee = updatedFollowee.toObject();

    console.log("Updated Followee", followee);
    console.log("Updated Follower", follower);

    res.json({
      followee: {
        ...followee, 
        followers: followee.followers.length,
        following: followee.following.length
      },
      follower: {
        ...follower, 
        followers: follower.followers.length,
        following: follower.following.length
      }
    });
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

const tokenIsValid = async (token) => {

  if (!token) return false;

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (!verified) return false;

  const user = await User.findById(verified.id);
  if (!user) return false;

  return true;
}

// returns a user with their  followers/following based on the followType string passed in
const getFollows = async (followType, userName) => {
  const [ user ] = await User.aggregate([
    {
      $match: { userName }
    },
    {
      $lookup: {
        from: "users",
        localField: followType,
        foreignField: "_id",
        as: followType
      }
    },
    {
      $project: {
        [`${followType}.userName`]: 1,
        [`${followType}.displayName`]: 1,
        [`${followType}._id`]: 1,
        'userName': 1,
        "displayName": 1
      }
    }
  ])
  .collation({locale: "en", strength: 2});

  return user || null;
}

module.exports = router;
