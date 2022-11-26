const app = require("./app");


const cloudinary = require("cloudinary")
const connactDataBase=require ("./config/database") 


//handling uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(`error:${err.message}`);
    console.log("shutting down the server due to unhandled process rejection")
    process.exit(1)
})

//config


if(process.env.NODE_ENV!=="PRODUCTION"){

    require("dotenv").config({path:"BackEnd/config/config.env"})
}
//connact DB
 
connactDataBase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


const server= app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`)
})

//unhaldled promice rejection

process.on("unhandledRejection",(err)=>{
    console.log(`error :${err.message}`)
    console.log("shutting down the server due to unhandled promise rejection");
  
    
    server.close(()=>{
        process.exit(1)
    })
})