import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import cookierParser from  "cookie-parser"
import {dbConnection} from './DB/dbConnection.js'
import { ErrorMiddleware } from './middlewares/error.js';


const app  = express()

app.use(cors({
    origin:[],
    methods:["GET","PUT","POST","DELETE"],
    credentials:true
}));

app.use(cookierParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

dbConnection()

app.use(ErrorMiddleware);

dotenv.config({path: './config/config.env'})


export default app;