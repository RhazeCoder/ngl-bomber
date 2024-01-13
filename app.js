const express = require("express");
const app = express();
const port = 3000;

const path = require("path");
const fs = require("fs");
const axios = require("axios");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', async (req, res) => {
  
  try {
    
    const html = await fs.readFile(path.join(__dirname, "public", "index.html"), "utf-8");
    res.send(html);
  } catch (error) {
    console.error("Error serving index.html file:", error);
    res.status(500).send("An error occurred while serving index.html file");
  }
});

app.post('/api/start', async (req, res) => {
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
  
  const usern = req.body.username;
  const message = req.body.message;
  const total = req.body.total;
  const username = usern.toLowerCase();
  const deviceId = generateDeviceId();

  const url = 'https://ngl.link/api/submit';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  const data = {
    username: username,
    question: message,
    deviceId: deviceId
  };

  try {
    const response = await axios.post(url, data, { headers });
    const statusCode = response.status;
    console.log(`${statusCode}[${username}][${message}][${deviceId}]`);

    switch (statusCode) {
      case 200:
        const p_total = parseInt(total);
        const updatedTotal = p_total + 1;
        res.json({ update: updatedTotal, status: "Sent Success" });
        break;
      case 400:
        console.log('Bad Request: 400');
        res.status(400).json({ update: total, status: "Bad request" });
        break;
      case 404:
        console.log('Not Found: 404');
        res.status(404).json({ update: total, status: "User not found" });
        break;
      default:
        console.log('Unhandled status code:', statusCode);
        res.status(500).send('Unhandled status code');
        break;
    }
  } catch (error) {
    res.status(200).json({ update: total, status: "Retrying..." });
  }
});

app.listen(port, () => {
  console.log("Listening on port:", port);
});