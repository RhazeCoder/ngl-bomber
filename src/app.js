const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const fs = require("fs");
const axios = require("axios");

app.use(express.json());
app.use(express.static("public"));

app.get('/', async (req, res) => {
  try {
    const html = await fs.promises.readFile(path.join(("public", "index.html"), "utf-8"));
    res.send(html);
  } catch (error) {
    console.error("Error serving index.html file:", error);
    res.status(500).send("An error occurred while serving index.html file");
  }
});

app.post('/api/send', async (req, res) => {
  function generateDeviceId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let deviceId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      deviceId += characters.charAt(randomIndex);
    }
  
    return deviceId;
  }

  function randIP() {
    let ip = [];
    for (let i = 0; i < 4; i++) {
      ip.push(Math.floor(Math.random() * 255));
    }

    return ip.join('.');
  }
  
  const usern = req.body.username;
  const message = req.body.message;
  const total = req.body.total;
  const username = usern.toLowerCase();
  const deviceId = generateDeviceId();

  const url = 'https://ngl.link/api/submit';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-forwarded-for': randIP(),
  };

  const data = {
    username: username,
    question: message,
    deviceId: deviceId
  };

  try {
    const response = await axios.post(url, data, { headers });
    const statusCode = response.status;
    console.log(`${statusCode}[${username}][${message}]`);

    switch (statusCode) {
      case 200:
        res.json({ update: updatedTotal, status: "Sent Success" });
        break;
      case 400:
        console.log('Bad Request: 400');
        res.status(400).json({ status: "Bad request" });
        break;
      case 404:
        console.log('Not Found: 404');
        res.status(404).json({ status: "User not found" });
        break;
      default:
        console.log('Unhandled status code:', statusCode);
        res.status(500).send('Unhandled status code');
        break;
    }
  } catch (error) {
    res.status(200).json({ , status: "Retrying..." });
  }
});

// listen for requests :)
app.listen(port, () => {
  console.log("Listening on port:", port);
  console.log("Access the app browser\nhttp://localhost:3000");
});