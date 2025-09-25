let express = require('express');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let cors = require('cors');
const cookieParser = require('cookie-parser');

const User = require('./Route/UserRoute');
const Task = require('./Route/taskRoute');

dotenv.config();

const app = express();

// Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://teal-malasada-89341b.netlify.app"
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman, Render internal requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin); // debug blocked origins
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/User", User);
app.use("/task", Task);

// Start server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is listening at PORT ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

start();
