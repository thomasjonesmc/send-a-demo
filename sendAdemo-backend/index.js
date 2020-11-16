const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//Setup Express

const app = express();
app.use(express.json());
app.use(cors());

//process.env.PORT is used if the project is deployed
//an environment variable will be assigned to it via the hoster
//if not deployed, project will use port 8080
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));

//setting up mongoose
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB Connection Established.");
  }
);

//set up routes
app.use("/users", require("./routes/userRouter"));
app.use("/demos", require("./routes/demoRouter"));
