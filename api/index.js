const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Score = require('../backend/models/scores');

dotenv.config();

const app = express();

// Configure CORS for both local development and Vercel deployment
const corsOptions = {
  // Use Vercel's environment variables to determine the correct origin
  origin: process.env.NODE_ENV === 'production' ? 'https://quiz-app-mu-liard.vercel.app' : 'http://localhost:3000',
  methods: ['GET', 'POST'],
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(
    process.env.MONGO_URI ||
      'mongodb+srv://subhajitbag829:subha829@cluster0.m4spiwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 📝 Save score and username
app.post('/score', async (req, res) => {
  const { username, score } = req.body;

  if (!username || typeof score !== 'number') {
    return res.status(400).json({ message: "Username and valid score are required" });
  }

  const newScore = new Score({ username, score });

  try {
    const saved = await newScore.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📊 (Optional) Get all scores sorted
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 });
    res.json(scores);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// The key change for Vercel deployment!
// You must remove app.listen() and instead export the app
// Vercel will handle the server start for you
module.exports = app;