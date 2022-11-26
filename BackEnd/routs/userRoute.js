const { Router } = require("express");
const express =require("express");
const {registerUser, loginUser,logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser}=require("../controller/userControler");
const {isAuthenticateUser,authorizedRoles}=require("../middleware/authentication")
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logOut)
router.route("/me").get(isAuthenticateUser,getUserDetails)
router.route("/password/update").put(isAuthenticateUser,updatePassword)
router.route("/me/update").put(isAuthenticateUser,updateProfile)
router.route("/admin/users").get(isAuthenticateUser,authorizedRoles("admin"),getAllUser)
router.route("/admin/user/:id").get(isAuthenticateUser,authorizedRoles("admin"),getSingleUser).put(isAuthenticateUser,authorizedRoles("admin"),updateUserRole).delete(isAuthenticateUser,authorizedRoles("admin"),deleteUser)

module.exports=router;