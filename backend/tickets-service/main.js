const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Match, Ticket } = require('../utils/database-utils.js');
const { Kafka } = require('kafkajs');
const cors = require('cors');

const app = express();
const port = 80;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://admin:admin@database:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

// Kafka connection
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ['kafka:9092'],
    maxInFlight: 100,
    requestTimeout: 30000,
    producer: {
        maxMessageSize: 1048576000
    }
});

// Init Kafka function
async function initKafka() {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    await admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating Topic invoices");
    await admin.createTopics({
        topics: [
            {
                topic: "invoices",
                numPartitions: 1,
            },
        ],
    });
    console.log("Topic Created Success invoices");

    console.log("Disconnecting Admin...");
    await admin.disconnect();
}

// Initialize Producer
async function initProducer() {
    const producer = kafka.producer();
    console.log("Connecting Producer...");
    await producer.connect();
    console.log("Producer Connected Successfully");

    return producer;
}

// Connect producer to Kafka
let producer;
initKafka().then(() => {
    initProducer().then(p => {
        producer = p;

        // Now start the Express server after Kafka is ready
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }).catch(console.error);
});

// Ticket endpoint
app.options('/tickets/:match_id', async (req, res) => {
    res.status(200).send("");
});

app.post('/tickets/:match_id', async (req, res) => {
    const { token } = req.body;
    try {
        const verifToken = jwt.verify(token, "your_jwt_secret");
        const match = await Match.findOne({ _id: req.params.match_id });
        if (!match) {
            return res.status(404).json({ message: 'Invalid match' });
        }
        const ticket = new Ticket({ matchId: match._id, buyerId: verifToken.id });
        await ticket.save();

        // Send message to Kafka
        await producer.send({
            topic: "invoices",
            messages: [
                {
                    partition: 0,
                    key: "new invoice",
                    value: JSON.stringify(ticket),
                },
            ],
        });

        res.status(200).json({ ticket: ticket, match: match });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'User not authenticated' });
    }
});
