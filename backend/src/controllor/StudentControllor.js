const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");
const {
  passwordencrypt,
  validatePassword,
} = require("../services/CommonServices");
const { TokenGenerateStudent } = require("../utils/jwt.js");
const { blockTokens,StudentToken } = require("../middleware/Auth");
const MessageRespons = require("../utils/MessageRespons.json");

exports.StudentRegister = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (blockTokens.has(token)) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "User logged out.",
      });
    }
    let StudentData = req.body;
    let {
      StudentName,
      Gender,
      Category,
      Email,
      password,
      Phone,
      Address,
      CourseName,
      BranchName,
      Class,
    } = req.body;

    if (!StudentName || !Email || !Phone) {
      return res.status(400).json({
        status: 400,
        message: "StudentName, Email, and PhoneNumber are required fields.",
      });
    } else if (!validatePassword(StudentData.password)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: MessageRespons.passwordvalidate,
      });
    } else {
      const checkEmail = await Student.findOne({ Email });
      const checkPhone = await Student.findOne({ Phone });

      if (checkEmail || checkPhone) {
        const message = checkEmail
          ? "Email already exists."
          : "Phone number already exists.";

        return res.status(400).json({
          status: 400,
          message,
        });
      } else {
        password = await passwordencrypt(password);
        created = moment(Date.now()).format("LLL");
        const student = new Student({
          StudentName: {
            FirstName: StudentName.FirstName,
            LastName: StudentName.LastName,
          },
          Gender,
          Category,
          password,
          Email,
          Phone,
          Address: {
            Address_Line_1: Address.Address_Line_1,
            City: Address.City,
            State: Address.State,
            PostalCode: Address.PostalCode,
            Country: Address.Country,
          },
          CourseName,
          BranchName,
          Class,
          created,
        });

        student
          .save()
          .then((data) => {
            return res.status(201).json({
              status: StatusCodes.CREATED,
              message: MessageRespons.created,
              StudentData: data,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: MessageRespons.bad_request,
            });
          });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    let { password, userName } = req.body;

    let studentLogin = await Student.findOne({
      $or: [{ Email: userName }, { Phone: userName }],
    });

    if (!studentLogin) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: MessageRespons.login,
      });
    } else if (studentLogin.isActivated) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: MessageRespons.isdeleted,
      });
    } else {
      const isvalid = await bcrypt.compare(password, studentLogin.password);
      console.log(isvalid);
      if (!isvalid) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: MessageRespons.notmatch,
        });
      } else {
        const { error, token } = await TokenGenerateStudent({
          _id: studentLogin._id,
        });
        if (error) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: MessageRespons.notcreatetoken,
          });
        } else {
          return res.status(200).json({
            status: StatusCodes.OK,
            success: true,
            accesstoken: token,
            message: MessageRespons.loginsuccess,
          });
        }
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: MessageRespons.notsuccess,
    });
  }
};

exports.studentFind = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (blockTokens.has(token)) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "User logged out.",
      });
    } else {
      let student = await Student.find({ _id: req.decodedstudent });

      if (!student) {
        return res.status(404).json({
          status: StatusCodes.UNAUTHORIZED,
          message: MessageRespons.login,
        });
      }else if(student.isActivated){
        return res.status(403).json({
          status: StatusCodes.FORBIDDEN,
          message: "Access denied. Student has been deleted ",
        });
      }else {
        res.status(200).json({
          status: StatusCodes.OK,
          student,
          message: "Student details found ",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: true,
      message: MessageRespons.internal_server_error,
    });
  }
};


exports.studentFindAll = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (blockTokens.has(token)) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "User logged out.",
      });
    }

    const filters = {
      CourseName: req.query.CourseName,
      "StudentName.FirstName": req.query.FirstName,
      "StudentName.LastName": req.query.LastName,
      "Address.State": req.query.State,
      "Address.City": req.query.City,
      Class: req.query.Class,
      BranchName: req.query.BranchName,
      Gender: req.query.Gender,
      Category: req.query.Category,
    };

    const aggregation = [];

    Object.keys(filters).forEach((value) => {
      if (filters[value]) {
        aggregation.push({
       
          $match: { [value]: filters[value] },
        });
      }
    });
    aggregation.push({
      $sort:{"StudentName.FirstName":1},
    })

    const [result] = await Student.aggregate([
      ...aggregation,
      {$project:{CourseName:1}},
      {
        $group: {
          _id:null,
          count: { $sum: 1 },
          data: { $push: "$$ROOT" },
        },
      },
      
    ]);

    const { data = [], count = 0 } = result || {};

    res.status(200).json({
      status: StatusCodes.OK,
      totalCount: count,
      message: "Student details Found",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: true,
      message: MessageRespons.internal_server_error,
    });
  }
};

exports.studentLogout = async (req, res) => {
  const token = req.headers.authorization;

 blockTokens.add(token);

  return res.status(200).json({
    status: StatusCodes.OK,
    message: MessageRespons.logout,
  });
};

exports.studentDelete = async (req, res) => {
  try {
    let studentdata = await Student.findByIdAndUpdate(
      
      { _id },
      { $set: { isActivated: true } },
      { new: true }
    );
    console.log(studentdata);
    if (!studentdata) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Student not found",
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
      studentdata,
        message: "Student Delete Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: MessageRespons.internal_server_error,
    });
  }
};
exports.studentUpdate = async (req, res) => {
  try {
    let { Email, phone } = req.body;

    const studentEmail = Email ? Email.toLowerCase() : undefined;

    const checkemail = await Student.findOne({
      Email,
      _id: { $ne:  req.decodedstudent },
    });
    const checkphone = await Student.findOne({
      phone,
      _id: { $ne:  req.decodedstudent },
    });

    if (checkemail || checkphone) {
      const message = checkemail
        ? MessageRespons.checkemail
        : MessageRespons.checkphone;

      res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message,
      });
    } else {
      created = moment(Date.now()).format("LLL");
      const { _id } =  req.decodedstudent;

      const student = await Student.findById(_id);

      if (!student) {
        return res.status(404).json({
          status: 404,
          message: "User Credential Invalied",
        });
      } else {
        let student = {
          Email: studentEmail,
          phone,
          document: req.documentUrl,
          created,
        };

        const UserUpdate = await Student.findByIdAndUpdate(
          { _id },
          { $set: student },
          { new: true }
        );

        return res.status(201).json({
          status: StatusCodes.CREATED,
          message: MessageRespons.created,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: MessageRespons.internal_server_error,
    });
  }
};

exports.ChangePassword = async (req, res) =>{
  try {
    const userId = req.decodedstudent
    const student = await Student.findOne({_id:userId})
    let {oldpassword, newpassword, confirmpassword} = req.body

    if(!oldpassword || !newpassword || !confirmpassword){
    return res.status(403).json({
      status:StatusCodes.FORBIDDEN,
      message:"Filed are required"
    })
    }else if(!validatePassword(password)){
      return res.status(400).json({
        status:StatusCodes.BAD_REQUEST,
        message:"Password not Validate"
      })
    }else if(newpassword !== confirmpassword){
      return res.status(400).json({
        status:StatusCodes.BAD_REQUEST,
        message: "new and confirm password not match"
      })
    }else{
      const samePassword = await bcrypt.compare(oldpassword, student.password)
      
      if(!samePassword){
        return res.status(400).json({
          status:StatusCodes.BAD_REQUEST,
          message:"Old password not match"
        })
      }else{
        const newSamePassword = await bcrypt.compare(newpassword, student.password)
        
        if(newSamePassword){
          return res.status(400).json({
            status:StatusCodes.BAD_REQUEST,
            message: "New and old password are same"
          })
        }
        else {
          const passwordHash = await passwordencrypt(
            newpassword,
            student.password
          );

          const studentUpdate = await Student.findByIdAndUpdate(
            { _id: student._id },
            { $set: { password: passwordHash } },
            { new: true }
          );

          return res.status(200).json({
            status: StatusCodes.OK,
            studentUpdate,
            message: "Password successfully change",
          });
        }
      }
    }
    
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: MessageRespons.internal_server_error,
    });
  }
}