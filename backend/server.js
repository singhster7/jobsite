const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const passport = require("passport");
var cors = require("cors");
const fileUpload = require("express-fileupload");

const api = require("./routes/api");
const app = express();
app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use("/api", api);
const Applicant = require("./models/Applicant");

app.use(fileUpload());
// file upload api
app.post("/upload", (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" });
  }
  // accessing the file
  const myFile = req.files.file;
  //  mv() method places the file inside public directory
  myFile.mv(
    `${__dirname}/uploads/${req.body.user}${myFile.name}`,
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      Applicant.findOne({ _id: req.body.user }).then((applicant) => {
        if (req.body.type === "resume") {
          applicant.resumeName = myFile.name;
        } else if (req.body.type === "image") {
          applicant.imageName = myFile.name;
        }
        applicant
          .save()
          .then((applicant) => res.json(applicant))
          .catch((err) => {
            console.log(err);
          });
      });
    }
  );
});

app.post("/download", (req, res) => {
  res.download(__dirname + `/uploads/${req.body.user}${req.body.filename}`);
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
