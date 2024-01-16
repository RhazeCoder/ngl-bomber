import express from "express";

const app = express();
const port = 3000;

async function listen () {
    app.use(express.json());
    app.use(express.static("public"));

    // listen for requests :)
    app.listen(port, () => {
        console.log("Listening on port:", port);
        console.log("Access the app browser\nhttp://localhost:3000");
    });
}

export { listen };