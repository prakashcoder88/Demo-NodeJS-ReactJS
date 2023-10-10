const express = require("express");
const router = express.Router();

const StudentData = require("../controllor/StudentControllor");
//const UserData = require("../controllor/UserControllor");
require("../models/Student");
const User = require("../models/user")
const { UserToken, restrict, StudentToken } = require("../middleware/Auth");


router.post("/studentregister", UserToken,restrict("admin"),StudentData.StudentRegister);
router.post("/studentlogin", StudentData.studentLogin);
router.get("/studentview", StudentToken,StudentData.studentFind);
router.get("/studentfindall", UserToken,restrict("admin"),StudentData.studentFindAll);
router.post("/studentlogout", StudentToken,StudentData.studentLogout);
router.delete("/studentdelete", StudentToken,StudentData.studentDelete);

module.exports = router 