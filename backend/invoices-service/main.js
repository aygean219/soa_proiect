import mongoose from "mongoose";
import {Kafka} from "kafkajs";
import amqp from "amqplib/callback_api.js";
import {Match, User} from "../utils/database-utils.js"

//database connection
mongoose.connect("mongodb://admin:admin@database:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

//kafka connection
const kafka = new Kafka({
    clientId: "my-app",
    brokers: ['kafka:9092'],
});
// {"matchId": "67a511ab93314d75dd5bd9c1", "buyerId": "67a50debbe3fad3c15856248"}

async function init() {
    const consumer = kafka.consumer({groupId: "my-app"});
    await consumer.connect();

    await consumer.subscribe({ topics: ["invoices"], fromBeginning: true });
    amqp.connect("amqp://admin:admin123@rabbitmq", function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(async function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = 'emails';

            channel.assertQueue(queue, {
                durable: false
            });

            await consumer.run({
                eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                    const parsedMessage = JSON.parse(message.value.toString());
                    const user = await User.findOne({_id: parsedMessage.buyerId});
                    const match = await Match.findOne({_id: parsedMessage.matchId});
                    if (!user || !match){
                        console.log("Invalid user or match on the ticket invoice.");
                        return;
                    }
                    const payload = {email: user.email,
                        player1: match.player1,
                        player2: match.player2,
                        tournament: match.tournament,
                        court: match.court,
                        date: match.date,
                        price: match.price
                    };
                    console.log(
                        `[${topic}]: PART:${partition}:`,
                        JSON.stringify(payload)
                    );
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
                    console.log(" [x] Sent %s", JSON.stringify(payload));
                },
            });
        });
    });

}

init();
