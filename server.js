const express = require("express");
const { firestore } = require("firebase-admin");
const app = express();
const port = 3000;
const admin = require("firebase-admin");

var serviceAccount = require("./recoupe-fees-firebase-adminsdk-td55n-1bd89ba3b1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = firestore();

app.use(express.json());
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "http://moreprofits.recoupefees.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/save", (req, res) => {
  req.body.createdAt = firestore.FieldValue.serverTimestamp();
  db.collection("calculations")
    .add(req.body)
    .then((docRef) => {
      console.log("Calculation written with ID: ", docRef.id);

      res.sendStatus(200);
    })
    .catch((error) => {
      console.log("Error adding document: ", error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`App is listenting to port ${port}`);
});
