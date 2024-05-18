const serverless = require("serverless-http");
const express = require("express");
const { bot} = require("../../bot-commands");
const cors = require("cors");
const app = express();
const router = express.Router();
require("dotenv").config();
const token = process.env.TOKEN;
app.use(cors())
app.use(express.json())

router.post(`/${token}`, async (req, res)=>{
    try{
        const message = req.body ;
        await bot.handleUpdate(message)
        res.status(200).json({body: ""})
    }catch(err){
        console.log(err);
        res.status(409).json({body:"error didn't find out "})
    }
})
router.get("/", async(req, res)=>{
    console.log('resived')
    res.status(200).json({hi:"hi"})
})

// setting up the express app
app.use("/.netlify/functions/bot", router)

exports.handler = serverless(app)