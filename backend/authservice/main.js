const express = require('express');
require('dotenv').config();
//console.log("Database URL:", process.env.DATABASE_URL);
const app = express()
const port = 80
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../utils/database-utils.js');


mongoose.connect("mongodb://admin:admin@database:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin"
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB:", err));

app.use(express.json())

app.get('/auth', (req, res) => {
    res.send('authservice')
})

app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user without hashing the password
        const newUser = new User({
            email,
            password // Store the password as it is
        });

        // Save user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, "your_jwt_secret", { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare passwords
        const isMatch = password === user.password;
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate a token (optional)
        const token = jwt.sign({ id: user._id }, "your_jwt_secret", { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
