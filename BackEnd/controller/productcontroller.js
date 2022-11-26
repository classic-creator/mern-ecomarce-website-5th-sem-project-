const Product = require("../models/productModels");
const ErrorHander = require("../utils/errorHandler");
const catchAsynceError =require("../middleware/catchAsynceError");
const ApiFeature = require("../utils/apiFeature");
const { query } = require("express");
const cloudinary = require("cloudinary")
//creat product

exports.createProducts = catchAsynceError(async (req, res, next) => {

 let images=[]

 if(typeof req.body.images==="string"){
    images.push(req.body.images)
 }else{
    images=req.body.images
 }

 const imagesLink=[]

 for (let i = 0; i < images.length; i++) {
   const result = await cloudinary.v2.uploader.upload(images[i],{
    folder:"products"
   })
    imagesLink.push({
        public_id:result.public_id,
        url:result.secure_url
    })
 }
    req.body.user=req.user.id
    req.body.images=imagesLink

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//get all product

exports.getAllProducts = catchAsynceError(async (req, res) => {

   const resultPerPage=8;
    const productsCount=await Product.countDocuments();

                                                                           //add search feature //filter
                                                                            
   const apiFeature= new ApiFeature(Product.find(),req.query).search().filter().pageination(resultPerPage);
  
   let products=await apiFeature.query
   let filteredProductsCount=products.length;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
}
)

//get all product  -- ADMIN

exports.getAdminProducts = catchAsynceError(async (req, res) => {

   const products=await Product.find()

     res.status(200).json({
         success: true,
         products,
        
     })
 }
 )


//get product detail


exports.getProductDetails = catchAsynceError(async (req,res,next)=>{

    const product= await Product.findById(req.params.id);

    if(!product){

        return next(new ErrorHander("product not found",404))
    }
    
        return res.status(200).json({
            success:true,
            product,
           
        })
    
})


//update product admin

exports.updateProduct = catchAsynceError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("product not found",404))
    }

    //images start here

    let images=[]

    if(typeof req.body.images==="string"){
       images.push(req.body.images)
    }else{
       images=req.body.images
    }

    if(images!==undefined){
        //deleting image from cloudinery
    for(let i=0; i<product.images.length; i++)
    {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    const imagesLink=[]

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i],{
       folder:"products"
      })
       imagesLink.push({
           public_id:result.public_id,
           url:result.secure_url
       })
    }

    req.body.images=imagesLink
    }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })


    res.status(200).json({
        success: true,
        product
    })
})

// delete product

exports.deleteProduct = catchAsynceError(async (req, res, next) => {
   

    const product = await Product.findById(req.params.id);


    //deleteing image from cloudinery

    for(let i=0; i<product.images.length; i++)
    {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    if (!product) {
        return next(new ErrorHander("product not found",404))
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "product delete successfully"
    })
})
//creat new review and update review

exports.creatProductReview= catchAsynceError(async(req,res,next)=>{
   
    const { rating,comment, productId} = req.body;

    const review ={

        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment

    };

    const product = await Product.findById(productId)

    const isReviewed = product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    );

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if (rev.user.toString()===req.user._id.toString())
            (rev.rating=rating),(rev.comment=comment);
        });

    }   else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length  
      }
      

      let avg=0;
        product.reviews.forEach((rev)=>{      //formula for rating   
        avg+=rev.rating
      })
      

      product.ratings=avg/product.reviews.length;

      await product.save({validateBeforeSave :false});

      res.status(200).json({
        success:true,
      })
})
//get all reviews of a product

exports.getProductReviews=catchAsynceError(async(req,res,next)=>{

    const product=await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHander("product not found",404))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    })

});

//delete reviews

exports.deleteReviews=catchAsynceError(async(req,res,next)=>{

    const product=await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHander("product not found",404))
    }

    const reviews= product.reviews.filter((rev)=>rev._id.toString() !== req.query.id.toString())

    let avg=0
    reviews.forEach((rev)=>{
        avg += rev.rating;
    })

    let ratings=0;
    if(reviews.length===0){
        ratings=0
    }else{
        
        ratings =avg/reviews.length 
    }



    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{reviews,ratings,numOfReviews},{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        
    })

});