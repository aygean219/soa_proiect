const express = require('express')
const app = express()
const port = 80
const mongoose = require('mongoose');
const {Match} = require("../utils/database-utils");

mongoose.connect("mongodb://admin:admin@database:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

app.use(express.json())


app.get('/matches', (req, res) => {
    res.send('matches-service')
})

app.get('/matches/matches', async (req, res) => {
    try {
        const matches = await Match.find(undefined, undefined, undefined);
        res.send(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get(`/matches/matches/:matchId`, async (req, res) => {
    try {
        const match = await Match.findOne({_id: req.params.matchId});
        res.send(match);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
console.log("Registered routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
});
app.post('/matches/matches', async (req, res) => {
    try {
        const { player1, player2, tournament, court, date, price } = req.body;

        if (!player1 || !player2 || !tournament || !court || !date || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newMatch = new Match({
            player1,
            player2,
            tournament,
            court,
            date: new Date(date),
            price
        });

        await newMatch.save();
        res.status(201).json({ message: 'Match added successfully', match: newMatch });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})