import express from 'express';
import mongoose from 'mongoose';
import VehicleRouter from './/routes/VehicleRoutes'

const app = express();

mongoose.connect("mongodb://localhost:27017/greenshadownode")
const db = mongoose.connection

db.on("error",(error)=>{
    console.error("DB connection error : ",error)
})

db.on("open",()=>{
    console.log("DB connected successfully")
})

app.use(express.json());
app.use('/',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type');

    next();
})


app.listen(3000, (err=>{
    console.log("Server running on port 3000");
}));
app.use('/vehicle',VehicleRouter)

app.use('/',(req,res,next)=>{
    res.status(400).send('Not Found');
})
