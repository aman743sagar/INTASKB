let express = require('express');
let mongoose = require('mongoose');
let dotenv =require('dotenv')
let cors= require('cors')
const cookieParser = require('cookie-parser');





const User=require('./Route/UserRoute')
const Task=require('./Route/taskRoute')


dotenv.config()






const app = express();



app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json())
app.use(cookieParser());


app.use("/User",User)
app.use("/task",Task)






const start=async()=>{
    let connection=await mongoose.connect(process.env.MONGO_URI)
    console.log("Mongo DB is connected");
    app.listen(process.env.PORT,()=>{
        console.log("Server is listen at PORT 8000");
    })
}
start()