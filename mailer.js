const nodemailer = require("nodemailer");
const Hogan = require("hogan.js");
const fs = require("fs-extra");
var temp = fs.readFileSync("./app/email/notification.hjs", "utf-8");
var compiled = Hogan.compile(temp);

async function main() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let data = {
    firstName: "James",
    lastName: "Smith",
  };

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "dgarciajr1182@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "ID : 5lR6Ehh0C0sNTPtCd6Oy", // plain text body
    html: compiled.render(data), // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);
