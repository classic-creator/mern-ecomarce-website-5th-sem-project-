const ErrorHander=require("../utils/errorHandler");


module.exports =(err,req,res,next)=>{

    err.statusCode=err.statusCode || 500;
    err.message=err.message || "internal sever err"

    //wrong mongodb error

    if(err.name==="CastError"){
        const message=`resource  found invalide ${err.path}`
        err=new ErrorHander(message,400);
    }

    //mongoo dublicket key erroe


    if (err.code===11000){
        const message=`dublicate ${Object.keys(err.keyValue)} entered`
        err=new ErrorHander(message,400)
    }

    //wrong jwt error
    if(err.name==="jsonWebTokenError"){
        const message=`json web token is invalid try again`;
        err = new ErrorHander(message,400);
    }
     // jwt expire error
     if(err.name==="TokenExpiredError"){
        const message=`json web token is expired try again`;
        err = new ErrorHander(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};