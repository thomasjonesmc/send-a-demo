const Demo = require("../models/demoModel");
const Track = require("../models/trackModel");
const { ObjectId } = require('mongoose').Types;
const s3 = require("../services/s3.service");

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

const getDemoById = (demoId) => {
    return Demo.findById(demoId).populate({
        path: "tracks",
        model: Track,
    });
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
    deleteTrackAudio
}