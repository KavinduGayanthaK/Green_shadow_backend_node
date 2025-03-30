import express from 'express';
import mongoose from 'mongoose';
import VehicleRouter from './/routes/VehicleRoutes'
import StaffRouter from './/routes/StaffRoutes'
import FieldRouter from './/routes/FieldRoutes'
import CropRouter from './/routes/CropRoutes'
import LogRouter from './/routes/LogRoutes'
import AuthRoutes from './/routes/AuthRoutes'
import EquipmentRouter from './/routes/EquipmentRoutes'
import { authenticateToken } from './middleware/Authenticate';
import  dotenv  from 'dotenv';
import cors from 'cors';


const app = express();
dotenv.config();

mongoose.connect("mongodb://localhost:27017/greenshadownode")
const db = mongoose.connection

db.on("error",(error)=>{
    console.error("DB connection error : ",error)
})

db.on("open",()=>{
    console.log("DB connected successfully")
})

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,PUT,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true 
}));


app.use('/auth', AuthRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/vehicle',authenticateToken,VehicleRouter);
app.use('/staff',authenticateToken,StaffRouter);
app.use('/field',authenticateToken,FieldRouter);
app.use('/equipment',authenticateToken,EquipmentRouter);
app.use('/crop',authenticateToken,CropRouter);
app.use('/log',authenticateToken,LogRouter);



app.use('/',(req,res,next)=>{
    res.status(400).send('Not Found');
})


app.listen(3000, (err=>{
    console.log("Server running on port 3000");
}));