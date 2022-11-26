const express = require("express");
const { newOrder, getSingleOrder, myOrder, getAllOrders, updateOrders, deleteOrder } = require("../controller/orderController");
const router=express.Router()

const { isAuthenticateUser,authorizedRoles} = require("../middleware/authentication");



router.route("/order/new").post(isAuthenticateUser,newOrder)
router.route("/order/:id").get(isAuthenticateUser,getSingleOrder)
router.route("/orders/me").get(isAuthenticateUser,myOrder)
router.route("/admin/orders").get(isAuthenticateUser,authorizedRoles("admin"), getAllOrders)
router.route("/admin/order/:id").put(isAuthenticateUser,authorizedRoles("admin"),  updateOrders).delete(isAuthenticateUser,authorizedRoles("admin") , deleteOrder)

module.exports=router