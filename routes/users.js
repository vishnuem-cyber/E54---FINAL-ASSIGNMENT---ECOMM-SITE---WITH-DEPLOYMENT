const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const router = express.Router();
const secret_key = process.env.JWT_SECRET_KEY || 'secret123';

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, secret_key, { expiresIn: '1h' });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("Login req: ", email, password); // 👈 log this

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, secret_key, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
