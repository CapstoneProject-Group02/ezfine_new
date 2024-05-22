// const express = require("express");
// const bodyParser = require("body-parser");
// const twilio = require("twilio");
// const cors = require("cors");
// const app = express();
// const port = 3003;

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());

// const accountSid = "AC2d78b0ab262873d0fa0f8d106bee0caf";
// const authToken = "215ee493edea118ba883a1201b3c261c";
// const client = new twilio(accountSid, authToken);

// app.post("/sendSMS", (req, res) => {
//   const { phoneNumber, message } = req.body;

//   client.messages
//     .create({
//       body: message,
//       from: "+18482855437",
//       to: phoneNumber,
//     })
//     .then((message) => {
//       console.log(`SMS sent: ${message.sid}`);
//       res.status(200).json({ success: true });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ success: false, error: err.message });
//     });

//   // if (licenseStatus === "Blocked") {
//   //   const blockedMessage = "Your license card is blocked.";
//   //   client.messages
//   //     .create({
//   //       body: blockedMessage,
//   //       from: "+14143166709",
//   //       to: phoneNumber,
//   //     })
//   //     .then((message) => {
//   //       console.log(`SMS sent: ${message.sid}`);
//   //       res.status(200).json({ success: true });
//   //     })
//   //     .catch((err) => {
//   //       console.error(err);
//   //       res.status(500).json({ success: false, error: err.message });
//   //     });
//   // }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const { Vonage } = require("@vonage/server-sdk");
const cors = require("cors");
const app = express();
const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const vonage = new Vonage({
  apiKey: "76c48a21",
  apiSecret: "OnCIBpvf8oiJujrV",
});

app.post("/sendSMS", (req, res) => {
  const { message } = req.body;
  const from = "Vonage APIs";
  const to = "94764823372"; // Update with the recipient's number
  // Use the message variable instead of the string "message"
  const text = message;

  // Send the SMS
  vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
      // Send the response back to the client
      res.status(200).json({ message: "Message sent successfully" });
    })
    .catch((err) => {
      console.log("There was an error sending the message.");
      console.error(err);
      // Send the error response back to the client
      res.status(500).json({ error: "Failed to send message" });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
