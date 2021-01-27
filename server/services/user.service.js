const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const error = require("../util/error");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongoose').Types;

// user is an object with email, password, passwordCheck, displayName, userName
const createUser = async (user) => {

    // temporary validation
    for (let prop in user) {
        if (!user[prop]) { error("All Fields Required", 400); }
    }
    
    if (user.password.length < 5) {
        error("Password must be at least 5 characters", 400);
    }
    
    if (user.password !== user.passwordCheck) {
        error("Password must match password check", 400);
    }
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(user.password, salt);

    const newUser = await new User({
        email: user.email,
        password: passwordHash,
        displayName: user.displayName,
        userName: user.userName,
    }).save();

    // ignore the newUser's __v (mongoose version) and the user's password
    const { __v, password, ...rest } = newUser.toObject();

    return { ...rest, followers: 0, following: 0 }
}

const loginUser = async (loginIdentifier, password) => {

    // temporary validation
    if (!loginIdentifier || !password) {
        error("All Fields Required");
    }

    const foundUser = await User.findOne({ email: loginIdentifier }, { __v: 0 });
    const { password: foundPassword, ...user} = foundUser.toObject();

    if (!user) {
        error("No account with this email has been found", 400);
    }

    const isMatch = await bcrypt.compare(password, foundPassword);
    if (!isMatch) error("Invalid Credentials", 400);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return {
        token, 
        user: { 
            ...user,
            followers: user.followers.length,
            following: user.following.length
        }
    }
}

const deleteUserById = async (userId) => {
    return await User.findByIdAndDelete(userId);
}

const getUserById = async (userId) => {

    const foundUser = await User.findById(userId, { __v: 0, password: 0 });

    if (!foundUser) {
        error(`No user found with given Id`, 404);
    }

    const user = foundUser.toObject();

    return {
        ...user, 
        followers: user.followers.length, 
        following: user.following.length
    }
}

const getUserByUserName = async (userName) => {

    // collation for matching regardless of capitalization, this is built into our mongodb schema. ignore __v and password
    const foundUser = await User.findOne({ userName }, { __v: 0, password: 0 }).collation({locale: "en", strength: 2});

    if (!foundUser) {
        error(`No user found with username ${userName}`, 404);
    }

    const user = foundUser.toObject();

    return {
        ...user, 
        followers: user.followers.length, 
        following: user.following.length
    }
}

const getUserFollowersByUserName = async (userName) => {
    return getUserFollowsByUserName("followers", userName);
}

const getUserFollowingByUserName = (userName) => {
    return getUserFollowsByUserName("following", userName);
}

const followUser = (followerId, followeeId) => {
    return followUnfollow('follow', followerId, followeeId);
}

const unfollowUser = (followerId, followeeId) => {
    return followUnfollow('unfollow', followerId, followeeId);
}

// returns true if the followers does follow the followee, false otherwise
const userDoesFollow = async (followerId, followeeId) => {
    const user = await User.find({ 
        $and: [
            { _id: ObjectId(followerId) },
            { following: ObjectId(followeeId) }
        ]
    });
    
    return user.length !== 0; 
}

const searchUsers = async (search) => {

    const users = await User.find(
        { userName: { $regex: search, $options: "i"} },
        { displayName: 1, userName: 1, _id: 1 }
    );

    return users;
}

// helper function that we can reuse to get a user's followers and following
const getUserFollowsByUserName = async (followType, userName) => {
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
    
    if (!user) {
        error(`No user found with username ${userName}`, 404);
    }

    return user;
}

// helper function to follow/unfollow users
const followUnfollow = async (followType, followerId, followeeId) => {

    let arrayOperation = "";
    if (followType === "follow") { arrayOperation = "$push"; }
    else if (followType === "unfollow") { arrayOperation = "$pull"; }
    else { error("You can only follow or unfollow"); }
  
    const updatedFollower = await User.findOneAndUpdate(
        { _id: ObjectId(followerId) },
        { [arrayOperation]: { following: ObjectId(followeeId) } },
        {
            fields: { __v: 0, password: 0 },
            new: true
        }
    );
  
    const updatedFollowee = await User.findOneAndUpdate(
        { _id: ObjectId(followeeId) },
        { [arrayOperation]: { followers: ObjectId(followerId) } },
        {
            fields: { __v: 0, password: 0 },
            new: true
        }
    );
  
    const follower = updatedFollower.toObject();
    const followee = updatedFollowee.toObject();
  
    return {
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
    };
}

module.exports = {
    createUser,
    loginUser,
    deleteUserById,
    getUserById,
    getUserByUserName,
    getUserFollowersByUserName,
    getUserFollowingByUserName,
    followUser,
    unfollowUser,
    userDoesFollow,
    searchUsers
}