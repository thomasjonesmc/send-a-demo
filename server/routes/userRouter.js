const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/userModel");

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
    res.json(savedUser);
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

    const user = await User.findOne({ email: email }, { __v: 0 });
    
    if (!user)
      return res
        .status(400)
        .json({ error: "No account with this email has been found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        userName: user.userName
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
    
    const user = await User.findById(req.user);
    
    res.json({
      displayName: user.displayName,
      email: user.email,
      id: user._id,
      userName: user.userName
    });
    
  } catch (err) {
    console.log('ERROR', err.message);
    res.status(500).json({ error: err.message});
  }

});

router.get("/:userName", async (req, res) => {
  
  try {
    const { userName } = req.params;

    const foundUser = await User.findOne({ userName }, { __v: 0, password: 0 }).collation({locale: "en", strength: 2});

    if (!foundUser) throw new Error(`No user found with username ${userName}`);

    const user = foundUser.toObject();
    
    res.json(user);

  } catch (err) {
    res.status(500).json({error: err.message})
  }
});

router.get("/:userName/followers", async (req, res) => {
  
  try {
    const { userName } = req.params;

    const userFollowers = await User.aggregate([
      {
        $match: { userName }
      },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers"
        }
      }
    ])
    // .collation({locale: "en", strength: 2});

    console.log(userFollowers);
    
    res.json(userFollowers);

  } catch (err) {
    res.status(500).json({error: err.message})
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

module.exports = router;
