//dependencies....

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./routes/routes');
const {connectWithDB} = require('./utils/db');



const app = express();

app.use(morgan('dev')); 
app.use(express.json());


app.use(cors({
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
    


//handle basic route...
app.get('/',(req,res)=>{
    res.send("WELCOME TO BCKEND WORLD///");
})

app.use(router);


const port = process.env.PORT;


//connect Database..
connectWithDB(app,port)


