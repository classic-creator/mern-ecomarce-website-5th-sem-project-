const ErrorHander = require("../utils/errorHandler");
const catchAsynceError =require("../middleware/catchAsynceError");
const User= require("../models/userModel");
const { json } = require("express");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto")
const cloudinary=require("cloudinary")


//register user

exports.registerUser=catchAsynceError(async (req,res)=>{

   
    
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avater,{
        
        folder:"avaters",
        width:155,
        crop:"scale",
        
    })
    const {name,email,password}=req.body;

    const user = await User.create({
        name,
        email,
        password,
        avater:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    });

  sendToken(user,200,res)
});
//login user 
exports.loginUser=catchAsynceError(async(req,res,next)=>{
   
    const  { email,password }=req.body;

    if(!email||!password){
        return next(new ErrorHander("please enter email and password",400));
    }

    const user= await User.findOne({email}).select("+password")

    if(!user){

        return next(new ErrorHander("invalide email or password",401))

    }
    const isPasswordMatched= await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new  ErrorHander("invalide password or email ",401))
    }

   sendToken(user,200,res)
    
})

//logout

exports.logOut=catchAsynceError(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logged out"
    })
})
//forgot password
exports.forgotPassword=catchAsynceError( async(req,res,next)=>{
    const user=await User.findOne({ email:req.body.email})
    if(!user){
        return next(new ErrorHander("user not found ",404))
    }

    // get reset password token 
    const resetToken = user.getResetPasswordToken(); 
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message=`your password reset token is  : \n\n ${resetPasswordUrl}\n\n if you have not request this email then please ignore it `

    try{
        await sendEmail({

            email:user.email,
            subject:`Ecomarce password recovery`,
            message,
        });
        res.status(200).json({
            success:true,
            message:`email sent to ${user.email} successfully`,
        })
    }
    catch(error){
        user.resetPasswordToken=undefined
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHander(error.message,500))
    }

})


//reset passsword 

exports.resetPassword= catchAsynceError(async(req,res,next)=>{

    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({

        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},

    });

    if(!user){
        return next(new ErrorHander("reset password token is invalid or has been expired",400));

    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHander("password does not match",400))
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined

    await user.save()
    sendToken(user,200,res)
})

//get user details
exports.getUserDetails=catchAsynceError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    

    res.status(200).json({
        success:true,
        user,
    })
})
//update password
exports.updatePassword=catchAsynceError(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("old password is incorrect ",400))
    }
    if(req.body.newPassword !==req.body.confirmPassword){
        return next(new ErrorHander("password does not match",400))
    }
    
    user.password=req.body.newPassword
    await user.save()

    sendToken(user,200,res);
   
})

//update email and name(update user profile)
exports.updateProfile=catchAsynceError(async(req,res,next)=>{

   const newUserData= {
    name:req.body.name,
    email:req.body.email,
   }

   if (req.body.avater!==""){
    const user= await User.findById(req.user.id)

    const imageId= user.avater.public_id

    await cloudinary.v2.uploader.destroy(imageId)

    const myCloud=await cloudinary.v2.uploader.upload(req.body.avater,{
        
        folder:"avaters",
        width:155,
        crop:"scale",
        
    })

    newUserData.avater={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }


   }

   const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,

   })


   res.status(200).json({
    success:true,
    user
   })
   
   
})
//get all user

exports.getAllUser=catchAsynceError(async(req,res,next)=>{
    const users= await User.find();

    res.status(200).json({

        success:true,
        users,
    })
})

//get single user details (admin)

exports.getSingleUser=catchAsynceError(async(req,res,next)=>{
    const user= await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`user doesnot exist with id ${req.params.id}`,400))
    }

    res.status(200).json({

        success:true,
        user,
    })
})

//update user role -- admin

exports.updateUserRole=catchAsynceError(async(req,res,next)=>{

    const newUserData= {
     name:req.body.name,
     email:req.body.email,
     role:req.body.role,
    }

   await User.findByIdAndUpdate(req.params.id,newUserData,{
     new:true,
     runValidators:true,
     useFindAndModify:false,
 
    })
 
    res.status(200).json({
     success:true,
  
    })
    
    
 })

 //delete user -- admin

 exports.deleteUser=catchAsynceError(async(req,res,next)=>{

    const user= await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHander(`user doesnot exist with id :${req.params.id}`))
    } 

    const imageId= user.avater.public_id

    await cloudinary.v2.uploader.destroy(imageId)
    
    await user.remove()
 
    res.status(200).json({
     success:true,
     message:"user delete successful"
    })
    
    
 })