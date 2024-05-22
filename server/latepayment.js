const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ezfine",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: ", err);
    return;
  }
  console.log("Connected to database!");
});

app.post("/calculateLatePayment", (req, res) => {
  const { licenseNumber, paymentDate } = req.body;

  const getFineDatesQuery = `SELECT date FROM fines WHERE license_number = '${licenseNumber}'`;

  connection.query(getFineDatesQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching fine dates");
      return;
    }

    const fineDates = results.map((result) => result.date);

    const paymentDateObj = new Date(paymentDate);

    const lateDates = fineDates.filter((date) => {
      const fineDateObj = new Date(date);
      const daysLate = Math.ceil(
        (paymentDateObj - fineDateObj) / (1000 * 60 * 60 * 24)
      );
      return daysLate > 0;
    });

    const latePaymentFeePerDay = 10; // Assume late payment fee is 10 per day
    const latePaymentFee = lateDates.length * latePaymentFeePerDay;
    const totalFineAmount = 100 + latePaymentFee; // Assuming original fine amount is 100

    res.json({ lateDates, latePaymentFee, totalFineAmount });
  });
});

app.listen(3011, () => {
  console.log("Running backend server");
});
