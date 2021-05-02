const express = require("express");
const { firestore } = require("firebase-admin");
const app = express();
const port = 3000;
const admin = require("firebase-admin");

var serviceAccount = require("./recoupe-fees-firebase-adminsdk-td55n-1bd89ba3b1.json");

const nodemailer = require("nodemailer");
const Hogan = require("hogan.js");
const fs = require("fs-extra");
var temp = fs.readFileSync("./app/email/notification.hjs", "utf-8");
var compiled = Hogan.compile(temp);

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
      console.log(req.body);
      notify(req.body, docRef.id).catch(console.error);
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

async function notify(body, id) {
  //let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "amina57@ethereal.email",
      pass: "rb8sXX68sUuqU2Ryka",
    },
  });

  let data = {
    firstName: req.body.user.first_name,
    lastName: req.body.user.last_name,
    company: req.body.user.company,
    email: req.body.user.email,
    monthlyCreditCardCharges: req.body.inputs.monthly_credit_card_charges,
    montlhyDebitCardCharges: req.body.inputs.monthly_debit_card_charges,
    percentCustomersPayingWithCards:
      req.body.inputs.percent_customers_paying_with_cards,
    profitMargin: req.body.inputs.profit_margin,
    averageAmountPerCharge: req.body.inputs.average_amount_per_charge,
    annualSavings: req.body.calculations.annual_savings,
    monthlySavings: req.body.calculations.monthly_savings,
    increadedNetProfitMargin:
      req.body.calculations.increased_profit_margin_on_card_sales,
  };

  let info = await transporter.sendMail({
    from: '"'data.firstName + ' ' + data.lastName'" <' + data.email + '>', // sender address
    to: "dgarciajr1182@gmail.com", // list of receivers
    subject: "Recoupe Fees: More Profits Inquiry", // Subject line
    text: "ID : " + id, // plain text body
    html: compiled.render(data), // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
