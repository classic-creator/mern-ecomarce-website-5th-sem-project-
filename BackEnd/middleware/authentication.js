const ErrorHander = require("../utils/errorHandler");
const catchAsynceError=require("./catchAsynceError");
const jwt= require("jsonwebtoken")
const User=require("../models/userModel")


exports.isAuthenticateUser= catchAsynceError( async(req,res,next)=>{
    const { token }=req.cookies;
    if(!token){
        return next(new ErrorHander("please log in to access this resource",401))

    }

    const decodData= jwt.verify(token,process.env.JWT_SECERT)

   req.user= await User.findById(decodData.id);
   next();
})

//authorised role   admin

exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){

           return next(
               
               new ErrorHander(`role:${req.user.role} is not allowed to access this resouce`,403 )
            )
            
        }
        next();
    }
}