const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const multer = require("multer");
const ejs = require("ejs");
const app = express();
const assert = require("assert");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const MongoClient = require("mongodb").MongoClient;
mongoose.connect("mongodb://localhost:27017/state", {
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error:", console.error.bind("ERROR FOUND:"));
db.once("open", () => {
  console.log("Database Active!!");
});

const upload = multer();
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: String,
  studID: Number,
  pin: Number,
  age: Number,
  gender: String,
  CampusResid: String
});

const studentDetails = mongoose.model("studentDetails", studentSchema);
const newDetails = new studentDetails({
  name: "Hillton Nutrot",
  studID: 10682923,
  pin: 4444,
  age: 19,
  gender: "Male",
  CampusResid: "Yes"
});

newDetails.save();

const fewSchema = new Schema({
  halls: String,
  room: String
});
const newdata = mongoose.model("newdata", fewSchema);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("html files"));
app.set("views engine", "ejs");

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname + "/html files/home.html"));
});

app.post("/changes", upload.none(), (req, res) => {
  if (req.body.idnum == newDetails.studID && req.body.pin == newDetails.pin) {
    res.sendFile(__dirname + "/html files/changes.html");
  } else {
    res.send("INCORRECT CREDENTIALS!!!! ");
  }
});

app.post("/submit", (req, res) => {
  const stud = new newdata(req.body);
  stud.save();
  newdata.find({}, function(err, docs) {
    res.render("database.ejs", { docs: docs });
    console.log(docs);
  });
});

//app.post("/changes", (req, res) => {
//MongoClient.connect(
// "mongodb://localhost:27017/halls",
//  { useNewUrlParser: true },
//  (err, db) => {
//    if (err) throw err;
//    var dbo = db.db("halls");
//    dbo.collection("studentDetails").find({}, (err, data) => {
//      if (err) throw err;
//      res.send(JSON.stringify(data, getCircularReplacer()));
//    });
//  }
// );
//});

app.listen(3000, () => {
  console.log("Running on 3000");
});
