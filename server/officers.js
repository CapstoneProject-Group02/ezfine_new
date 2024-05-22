const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const bcrypt = require("bcrypt");
const salt = 10;
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const con = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "ezfine",
});

app.post("/register1", (req, res) => {
  const { email, username, password } = req.body;

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send({ message: "Error registering user" });
    }

    // Check if the email already exists in the database
    con.query(
      "SELECT * FROM officers WHERE email = ?",
      [email],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error checking email");
        } else if (result.length > 0) {
          res.status(400).json({ message: "Email already exists" });
        } else {
          // Check if the username already exists in the database
          con.query(
            "SELECT * FROM officers WHERE username = ?",
            [username],
            (err, result) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error checking username");
              } else if (result.length > 0) {
                res.status(400).json({ message: "Officer ID already taken" });
              } else {
                // Username does not exist, proceed with registration
                // Insert user details into the database
                con.query(
                  "INSERT INTO officers (email, username, password) VALUES (?, ?, ?)",
                  [email, username, hash],
                  (err, result) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error saving user details");
                    } else {
                      res.status(200).send("User registered successfully");
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
});

app.post("/login1", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res
      .status(400)
      .send({ message: "Please enter both username and password" });
    return;
  }

  // Fetch the hashed password from the database
  con.query(
    "SELECT * FROM officers WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving user details");
        return;
      }

      if (result.length === 0) {
        res.status(400).send({ message: "User not found" });
        return;
      }

      const hashedPassword = result[0].password;

      // Compare the hashed password with the password entered by the user
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error comparing passwords");
          return;
        }

        if (isMatch) {
          // Passwords match, login successful
          res.status(200).send({ message: "Login successful" });
        } else {
          // Passwords do not match
          res.status(400).send({ message: "Incorrect password" });
        }
      });
    }
  );
});

app.listen(3009, () => {
  console.log("running backend server");
});
//3009
