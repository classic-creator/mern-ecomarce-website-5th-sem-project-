const express = require("express");
const { getAllProducts , createProducts, updateProduct, deleteProduct, getProductDetails, creatProductReview, getProductReviews, deleteReviews, getAdminProducts} = require("../controller/productcontroller");
const { isAuthenticateUser,authorizedRoles} = require("../middleware/authentication");
const router =express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticateUser, authorizedRoles("admin") ,getAdminProducts)

router.route("/admin/product/new").post(isAuthenticateUser, authorizedRoles("admin") ,createProducts);

router.route("/admin/product/:id").put(isAuthenticateUser, authorizedRoles("admin") ,updateProduct).delete(isAuthenticateUser, authorizedRoles("admin") ,deleteProduct)

router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticateUser,creatProductReview)
router.route("/reviews").get(getProductReviews).delete(isAuthenticateUser,deleteReviews)
module.exports=router