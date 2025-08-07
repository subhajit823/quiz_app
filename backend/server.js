const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Score = require('./models/scores');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

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

app.listen(3001, () => {
  console.log("Quiz server running at http://localhost:3001/");
});