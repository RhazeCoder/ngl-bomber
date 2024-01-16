import express from "express";
import { display } from "./utils/display.js";
import { listen } from "./utils/listen.js";
import { send } from "./utils/send.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get('/', async (req, res) => {
  display();
});

app.post('/api/send', async (req, res) => {
  send(req, res);
});

listen();