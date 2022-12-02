const catchAsynceError = require("../middleware/catchAsynceError")


const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.processPayment= catchAsynceError(async(req,res,next)=>{

    const myPayment=await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            company:"Ecomarce"
        }
    })

    res.status(200).json({success:true,
    client_secret:myPayment.client_secret})
})

exports.sendStripApiKey=catchAsynceError(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    })
    
})


// YOU DID NOT PROVIDE AN API KEY. YOU NEED TO PROVIDE YOUR API KEY IN THE AUTHORIZATION HEADER, USING BEARER AUTH (E.G. 'AUTHORIZATION: BEARER YOUR_SECRET_KEY'). SEE HTTPS://STRIPE.COM/DOCS/API#AUTHENTICATION FOR DETAILS, OR WE CAN HELP AT HTTPS://SUPPORT.STRIPE.COM/.