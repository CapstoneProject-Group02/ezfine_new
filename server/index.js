const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const filesToRun = [
  "officers.js",
  "users.js",
  "sendsms.js",
  "finessend.js",
  "getlicense.js",
  "payment.js",
  "latepayment.js",
];

filesToRun.forEach((file) => {
  exec(`node ${file}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running the on port ${PORT}`);
});
