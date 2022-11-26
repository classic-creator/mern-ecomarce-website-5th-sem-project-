const mongoose= require("mongoose")

const connactDataBase=()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
        console.log(`mongodb connact with server:${data.connection.host}`);
    
    })

}
module.exports= connactDataBase