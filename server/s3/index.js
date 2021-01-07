//Followed Medium article on uploading to S3
//link : https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
const aws = require("aws-sdk");

aws.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET = process.env.BUCKET;

const getSignedUrl = async (fileName, fileType) => {

    const s3 = new aws.S3();

    const signedUrl = await s3.getSignedUrlPromise("putObject", {
        Bucket: BUCKET,
        Key: fileName,
        Expires: 500,
        ContentType: fileType,
        ACL: "public-read"
    });

    return {
        signedUrl,
        url: `https://${BUCKET}.s3.amazonaws.com/${fileName}`
    }
}

const deleteFile = (key) => {
    const s3 = new aws.S3();

    const params = {
        Bucket: BUCKET,
        Key: `${key}.mp3`,
    };

    return new Promise((resolve, reject) => {
        s3.deleteBucket(params, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

module.exports = {
    getSignedUrl,
    deleteFile
}