const app = require("express")();
const mongoose = require("mongoose");

const connectionString =
  "mongodb://admin34:admin2@exercises_db:27017/exercises_db?authSource=admin";

const dbConnect = () =>
  mongoose.connect(
    connectionString,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    err => {
      if (err) {
        console.log(
          "Error while connecting to the database, retrying in 5 seconds"
        );
        setTimeout(() => {
          dbConnect();
        }, 5000);
      }
    }
  );

dbConnect();
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to db");
});

app.get("/", (req, res) => {
  res.send("Hello world edited");
});

app.listen(3000, () => {
  console.log(connectionString);
  console.log("runnign app");
});
