import express from 'express';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import bodyparser from 'body-parser';
import cors from 'cors';
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express();
const PORT = 3080;

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')

const adapter = new JSONFile(file)
const db = new Low(adapter)

app.use(bodyparser.json({ limit: '50mb' }))
app.use(bodyparser.urlencoded({extended: true}))
app.use(cors())

db.read();
db.data ||= {
    cards: []
}

app.get("/", (req, res) => {
    // health check
    res.sendStatus(200)
})

app.get('/cards', (req, res) => {
    console.log(req.route)
    res.json(db.data || [])
});

app.get("/cards/:cardId", (req, res) => {
    console.log(req.route)
    if (db.data) {
        const cardId = req.params.cardId;
        const card = db.data.find(card => card.id === cardId);
        if (!card) {
            res.sendStatus(404);
            return;
        }
        res.send(card)
        return;
    }
    res.sendStatus(500);
});

app.put("/cards", (req, res) => {
    console.log(req.route)
    db.data = req.body
    db.write();
    res.sendStatus(200);
    return;
})

app.post("/cards", (req, res) => {
    console.log(req.route)
    console.log(req.body)

    const dbData = db.data || [];
    dbData.push(req.body);
    db.data = dbData;
    db.write();
    res.sendStatus(201)
    return;
})

app.delete("/cards/:cardId", (req, res) => {
    console.log(req.route)
    if (db.data) {
        db.data = db.data.filter(x => x.id === req.params.cardId)
        db.write();
        res.sendStatus(200)
        return;
    }
    res.status(500)
})

app.listen(PORT, () => {
    console.log(`chuchu-backend listening on port ${PORT}`)
});