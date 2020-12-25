//Followed Medium article on uploading to S3
//link : https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689

const aws = require("aws-sdk");
require("dotenv").config();

//configuring aws with bucket info
aws.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const S3_BUCKET = process.env.BUCKET;

//exporting the func to be used elsewhere
exports.sign_s3 = (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;

  //set up payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: "public-read",
  };

  //making request to the s3 api to get a signed url that
  //  we can use to upload out file
  s3.getSignedUrl("putObject", s3Params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, error: err });
    }

    //data payload of what we are sending back, the url of the
    // signedRequest and a url of where we can access the content
    // after it is saved.

    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };

    res.json({ success: true, data: { returnData } });
  });
};

exports.delete_track = (req, res) => {
  const s3 = new aws.S3();
  const key = req.body.key;

  const params = {
    Bucket: S3_BUCKET,
    Key: `${key}.mp3`,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ sucess: false, error: err });
    } else {
      console.log(`Deleted: ${key}`);
      res.json(data);
    }
  });
};
