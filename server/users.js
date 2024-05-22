const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const salt = 10;
const bcrypt = require("bcrypt");

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

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send({ message: "Error registering user" });
    }

    con.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking email");
      } else if (result.length > 0) {
        res.status(400).json({ message: "Email already exists" });
      } else {
        con.query(
          "SELECT * FROM users WHERE username = ?",
          [username],
          (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error checking username");
            } else if (result.length > 0) {
              res.status(400).json({ message: "License Number already taken" });
            } else {
              con.query(
                "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
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
    });
  });
});

// app.get("/checkUsername/:username", (req, res) => {
//   const { username } = req.params;

//   con.query(
//     "SELECT * FROM users WHERE username = ?",
//     [username],
//     (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send("Error checking username");
//       } else {
//         res.status(200).json({ exists: result.length > 0 });
//       }
//     }
//   );
// });

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  console.log("=====>" + req.body);
  if (!username || !password) {
    res
      .status(400)
      .send({ message: "Please enter both username and password" });
    return;
  }

  con.query(
    "SELECT * FROM users WHERE username = ?",
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

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error comparing passwords");
          return;
        }

        if (isMatch) {
          res.status(200).send({ message: "Login successful" });
        } else {
          res.status(400).send({ message: "Incorrect password" });
        }
      });
    }
  );
});

app.listen(3008, () => {
  console.log("running backend server");
});
//3008
