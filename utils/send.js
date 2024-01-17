import axios from 'axios';
import { deviceid } from "./functions/deviceid.js";
import { ip } from "./functions/ip.js";

async function send(req, res) {
  let ipadd = await ip();
  let deviceId = await deviceid();
  
  const message = req.body.message;
  const username = req.body.username.toLowerCase();

  const url = 'https://ngl.link/api/submit';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-forwarded-for': ipadd,
  };

  const data = {
    username: username,
    question: message,
    deviceId: deviceId
  };

  try {
    const response = await axios.post(url, data, { headers });
    const statusCode = response.status;

    switch (statusCode) {
      case 200:
        res.json({ status: "Sent Success" });
        console.log(`[${username}][${message}] -- ${ipadd}`);
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
    console.log(error.message)
    res.status(200).json({ status: "Retrying..." });
  }
}

export { send };