const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
const matchSchema = new mongoose.Schema({
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    tournament: { type: String, required: true }, // Ex: Wimbledon, Roland Garros
    court: { type: String, required: true }, // Ex: Central Court
    date: { type: Date, required: true },
    price: { type: Number, required: true }
});

const Match = mongoose.model('Match', matchSchema);

const ticketSchema = new mongoose.Schema({
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = {
    User,
    Match,
    Ticket
};
