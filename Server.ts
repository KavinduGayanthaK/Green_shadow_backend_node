import express from 'express';


const app = express();



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

app.use('/',(req,res,next)=>{
    res.status(200).send('Not Found');
})
