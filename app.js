import express from "express";
import path from "path";
import { display } from "./utils/display.js";
import { send } from "./utils/send.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', async (req, res) => {
  display(req, res);
});

app.post('/api/send', async (req, res) => {
  send(req, res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port:", port);
  console.log("Access the app browser\nhttp://localhost:3000");
});