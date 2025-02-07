import amqp from "amqplib/callback_api.js";
amqp.connect("amqp://admin:admin123@rabbitmq",  function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        var queue = 'emails';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, function(msg) {
            const message = JSON.parse(msg.content.toString());

            console.log(" Sending email with following info: \nEmail: %s\nPlayer 1: %s\nPlayer 2: %s\nTournament: %s\nCourt: %s\nDate: %s\nPrice: %s",
                message.email,
                message.player1,
                message.player2,
                message.tournament,
                message.court,
                message.date,
                message.price
            );
            }, {
            noAck: true
        });
    });
});