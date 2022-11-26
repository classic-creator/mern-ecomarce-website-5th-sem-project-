const express=require("express")
const {processPayment,sendStripApiKey} = require("../controller/paymentController")
const {isAuthenticateUser}= require("../middleware/authentication")

const router=express.Router()

router.route("/payment/process").post(isAuthenticateUser,processPayment)
router.route("/stripeapikey").get(isAuthenticateUser,sendStripApiKey)

module.exports=router