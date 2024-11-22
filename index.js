// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
const uri = process.env.MONGO_URI;

mongoose.connect(uri,) .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the application if MongoDB connection fails
  });
  
  // Define schema and model
const loginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    mail: { type: String, required: true },
    image: { type: String, required: true },
    course: { type: String, required: true },

  });
  
  const Login = mongoose.model("Login", loginSchema);
  
  // Routes
  
  // Create a new post
  app.post("/api/login", async (req, res) => {
    try {
      const newLogin = new Login({
        name: req.body.name,
        number: req.body.number,
        mail: req.body.mail,
        image: req.body.image,  
        course: req.body.course
      });
      const savedLogin = await newLogin.save();
      res.status(200).json(savedLogin);
    } catch (error) {
      res.status(500).json({ error: error.message});
}
});

// Get all posts
app.get("/api/login", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const login = limit ? await Login.find().limit(limit) : await Login.find();
    res.status(200).json(login);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get post by ID
app.get("/api/login/:id", async (req, res) => {
  try {
    const login = await Login.findById(req.params.id);
    if (login) {
      res.status(200).json(login);
    } else {
      res.status(404).json({ error: "Login not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a post by ID
app.put("/api/login/:id", async (req, res) => {
  try {
    const login = await Login.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure the updated data is validated
    });
    if (login) {
      res.status(200).json(login);
    } else {
      res.status(404).json({ error: "data not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a post by ID
app.delete("/api/login/:id", async (req, res) => {
  try {
    const login = await Login.findByIdAndDelete(req.params.id);
    if (login) {
      res.status(200).json({ message: "Login deleted successfully" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});