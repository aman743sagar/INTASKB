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
  "https://intaskb.onrender.com"
];

app.use(cors({
  origin: function(origin, callback) {

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use("/User", User);
app.use("/task", Task);


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