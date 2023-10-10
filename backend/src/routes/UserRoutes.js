const express = require("express");
const router = express.Router();
const httpProxy = require('http-proxy');

const UserData = require("../controllor/UserControllor");
const StudentData = require("../controllor/StudentControllor");
const CommonService = require("../services/CommonServices")
const uploadfile = require("../middleware/Upload")
// const User = require("../models/user");
const { UserToken, restrict } = require("../middleware/Auth");


router.post("/register",UserData.Register);
router.post("/login", UserData.login);
router.get("/userdetail", UserToken, UserData.userfind);
router.patch("/update", UserToken, restrict('user','admin'),uploadfile,UserData.UserUpdate);
router.delete("/delete", UserToken, UserData.UserDelete);
router.post("/logout", UserToken, UserData.logout);
router.post("/upload", UserToken, UserData.uploadfile);
router.patch("/restpassword", UserToken, UserData.restpassword);
router.post ("/sendemail", UserData.SendOtpEmail)
router.post ("/forgotpassword", UserToken,UserData.forgotpassword)
router.post("/verifyotp",  CommonService.VerifyOTP);

router.get("/userdetailall", UserToken,restrict('admin'),UserData.userfindAll);


module.exports = router;
