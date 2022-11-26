const express =require("express");
const app= express()
const errorMiddleWare=require("./middleware/error")
const cookieParser=require("cookie-parser")
const dotenv= require("dotenv") 
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path=require("path")
//config


if(process.env.NODE_ENV!=="PRODUCTION"){

    require("dotenv").config({path:"BackEnd/config/config.env"})
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

//route import

const product = require("./routs/productRout");
const user=require("./routs/userRoute");
const order=require("./routs/orderRoute")
const payment=require("./routs/paymentRoute")

app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order)
app.use("/api/v1",payment)

app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

//middle ware for error
app.use(errorMiddleWare);

 module.exports =app