import fs from 'fs';
import path from 'path';

async function display(req, res) {
    try {
        const html = await fs.promises.readFile(path.join("public", "index.html"), "utf-8");
        res.send(html);
    } catch (error) {
        console.error("Error serving index.html file:", error);
        res.status(500).send("An error occurred while serving index.html file");
    }
}

export { display };