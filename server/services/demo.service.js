const Demo = require("../models/demoModel");
const Track = require("../models/trackModel");
const User = require("../models/userModel");
const { ObjectId } = require('mongoose').Types;
const s3 = require("../services/s3.service");
const error = require("../util/error");

// get demos where the user is the creator or in the list of contributors
const getPersonalUserDemos = (userId) => {
    return getDemos({
        $or : [
            { creatorId: ObjectId(userId) },
            { contributors: ObjectId(userId) }
        ]
    });
}

// get all demos where the user created the demo and it is public (for their profile)
const getPublicUserDemos = (userId) => {
    return getDemos({
        $and: [
            { creatorId: ObjectId(userId) },
            { isPublic: true }
        ]
    })
}

const getDemoById = async (demoId) => {
    
    const res = await Demo.findById(demoId)
        .populate({ path: "tracks", model: Track })
        .populate({ path: "creatorId", model: User, select: '-__v -password'});

    if (!res) return res;

    const { creatorId: creator, ...demo } = res.toObject();

    return {
        ...demo,
        creator
    };    
}

const createDemo = (creatorId, title) => {
    if (!title || !creatorId) {
        error('Demo must have a title and creator');
    }

    return new Demo({ creatorId, title }).save();
}

const addTrackToDemo = async (demoId, trackTitle, trackAuthor) => {
    const newTrack = new Track({
        trackTitle,
        trackPath: demoId,
        trackAuthor,
    });

    newTrack.trackPath += `/${newTrack._id}`;

    await Demo.findOneAndUpdate(
        { _id: demoId },
        { $push: { tracks: newTrack._id } },
        { new: true }
    );

    return newTrack.save();
}

const updateTrackUrl = (trackId, url) => {
    return Track.findByIdAndUpdate(trackId, { trackSignedURL: url });
}

const deleteDemoById = (demoId) => {
    return Demo.findByIdAndDelete(demoId);
}

const deleteTrack = async (demoId, trackId) => {
    const track = await Track.findByIdAndDelete(trackId);

    Demo.findOneAndUpdate(
        { tracks: trackId },
        { $pull: { tracks: trackId } },
        { new: true }
    );

    await s3.deleteFile(`${demoId}/${trackId}`);

    return track;
}

const deleteTrackAudio = async (demoId, trackId) => {
    await s3.deleteFile(`${demoId}/${trackId}`);
    const changedTrack = await updateTrackUrl(trackId, null);

    return { ...changedTrack.toObject(), trackSignedURL: null };
}

const addUserToDemo = async (demoId, userId) => {

    const pushDemo = await Demo.findOneAndUpdate(
        // add the user to the demo with the demoId if the user is not already in the array of contributors and not the creator
        { _id: demoId, creatorId: { $ne: userId }, contributors: { $ne: userId } },
        { $push: { contributors: userId } },
        { new: true }
    )
    .populate({ path: "tracks", model: Track })
    .populate({ path: "creatorId", model: User, select: '-__v -password'});

    if (!pushDemo) { error("Couldn't add user to demo"); }

    const { creatorId: creator, ...demo } = pushDemo.toObject();

    return { ...demo, creator }; 
}

// updates a demos title and isPublic status
const updateDemo = async (demoId, title, isPublic) => {

    const updatedDemo = await Demo.findByIdAndUpdate(demoId, {
        title, isPublic
    }, { new: true })
    .populate({ path: "tracks", model: Track })
    .populate({ path: "creatorId", model: User, select: '-__v -password'});

    if (!updatedDemo) { error("Couldn't update demo"); }

    const { creatorId: creator, ...demo } = updatedDemo.toObject();

    return { ...demo, creator };
}

// a helper function that gets demos, lets us pass in a custom mongo $match to filter
const getDemos = (match) => {

    return Demo.aggregate([
        // only get demos where the user is a creator or contributor
        { $match: match },
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
        // ignore the passwords and the creatorId since the creatorId gets stored in the creator object
        {
            $project: {
                "creator.password": 0,
                "creatorId": 0
            }
        }
    ]);
}

module.exports = {
    getPersonalUserDemos,
    getPublicUserDemos,
    getDemoById,
    createDemo,
    addTrackToDemo,
    updateTrackUrl,
    deleteDemoById,
    deleteTrack,
    deleteTrackAudio,
    addUserToDemo,
    updateDemo
}