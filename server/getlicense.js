const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());
// MySQL Connection
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

// Endpoint to get fines based on license number
app.get("/getFines", (req, res) => {
  const licenseNumber = req.query.licenseNumber;
  console.log("licenseNumber==>", licenseNumber);
  const query = `SELECT * FROM fines WHERE license_number = '${licenseNumber}'`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching fines: ", err);
      res.status(500).json({ error: "Failed to fetch fines." });
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(3005, () => {
  console.log("Server is running on port 3005");
});
