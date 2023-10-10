const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const httpProxy = require("http-proxy");
const moment = require("moment");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");

const User = require("../models/user");
const uploadfile = require("../middleware/Upload");
const { TokenGenerate } = require("../utils/jwt");
const { blockTokens } = require("../middleware/Auth");
require("../middleware/Auth");
const SendEmail = require("../services/EmailServices");
const MessageRespons = require("../utils/MessageRespons.json");

const {
  passwordencrypt,
  validatePassword,
  otp
} = require("../services/CommonServices");

exports.Register = async (req, res) => {
  try {
    let { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: MessageRespons.required,
      });
    } else if (!validatePassword(password)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: MessageRespons.passwordvalidate,
      });
    } else {
      const checkemail = await User.findOne({ email });
      const checkphone = await User.findOne({ phone });

      if (checkemail || checkphone) {
        const message = checkemail
          ? MessageRespons.checkemail
          : MessageRespons.checkphone;

        res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message,
        });
      } else {
        // document = req.documentUrl;

        password = await passwordencrypt(password);
        created = moment(Date.now()).format("LLL");
        let user = new User({
          name,
          email,
          phone,
          password,
          role,
          // document,
          created,
        });

        user.save().then((data, err) => {
          if (err) {
            return res.status(400).json({
              status: StatusCodes.BAD_REQUEST,
              message: "Not Register User",
            });
          } else {
            return res.status(201).json({
              status: StatusCodes.CREATED,
              message: "Successfully Register",
              UserData: data,
            });
          }
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

exports.login = async (req, res) => {
  try {
    let { password, MasterField, role } = req.body;

    let userLogin = await User.findOne({
      $or: [
        { email: MasterField },
        { name: MasterField },
        { phone: MasterField },
      ],
    });
    if (!userLogin) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: MessageRespons.login,
      });
    } else if (userLogin.isActivated) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: MessageRespons.isdeleted,
      });
    } else if (userLogin.role !== role) {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: "Please make sure you are logging in from the right portal.",
      });
    } else {
      const isvalid = await bcrypt.compare(password, userLogin.password);
      if (!isvalid) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: MessageRespons.notmatch,
        });
      } else {
        const { error, token } = await TokenGenerate({
          _id: userLogin._id,
          role,
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
            // Refreshtoken:refreshtoken,
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

exports.userfind = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (blockTokens.has(token)) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "User logged out.",
      });
    } else {
      const userfind = await User.find({ _id: req.decodeduser });

      if (!userfind) {
        return res.status(401).json({
          status: StatusCodes.UNAUTHORIZED,
          message: MessageRespons.login,
        });
      } else if (userfind.isActivated) {
        return res.status(403).json({
          status: StatusCodes.FORBIDDEN,
          message: "Access denied. User has been deleted ",
        });
      } else {
        res.status(200).json({
          status: StatusCodes.OK,
          userfind,
          message: "User Credential Found ",
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
exports.userfindAll = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (blockTokens.has(token)) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "User logged out.",
      });
    } else {
      const userfind = await User.find({});

      res.status(200).json({
        status: StatusCodes.OK,
        userfind,
        message: "User details Found ",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: true,
      message: MessageRespons.internal_server_error,
    });
  }
};

exports.UserUpdate = async (req, res) => {
  try {
    let { email, phone } = req.body;

    const userEmail = email ? email.toLowerCase() : undefined;

    const checkemail = await User.findOne({
      email,
      _id: { $ne: req.decodeduser },
    });
    const checkphone = await User.findOne({
      phone,
      _id: { $ne: req.decodeduser },
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
      const { _id } = req.decodeduser;

      const user = await User.findById(_id);

      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User Credential Invalied",
        });
      } else {
        let user = {
          email: userEmail,
          phone,
          document: req.documentUrl,
          created,
        };

        const UserUpdate = await User.findByIdAndUpdate(
          { _id },
          { $set: user },
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

exports.UserDelete = async (req, res) => {
  try {
    let user = await User.findByIdAndUpdate(
      { _id: req.decodeduser },
      { $set: { isActivated: true } },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
        user,
        message: "User Delete Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: MessageRespons.internal_server_error,
    });
  }
};
exports.logout = async (req, res) => {
  const token = req.headers.authorization;

  blockTokens.add(token);

  return res.status(200).json({
    status: StatusCodes.OK,
    message: MessageRespons.logout,
  });
};

exports.restpassword = async (req, res) => {
  try {
    const userId = req.decodeduser;
    const user = await User.findOne({ _id: userId });
    console.log(user);
    let { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: "Filed are required",
      });
    } else if (!validatePassword(newPassword)) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Password not validate",
      });
    } else if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "New password and Confirm password not match",
      });
    } else {
      const samePassword = await bcrypt.compare(oldPassword, user.password);

      if (!samePassword) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "Old password not match",
        });
      } else {
        const newSamePassword = await bcrypt.compare(
          newPassword,
          user.password
        );

        if (newSamePassword) {
          return res.status(400).json({
            status: StatusCodes.BAD_REQUEST,
            message: "Old password and New Password are same ",
          });
        } else {
          const passwordHash = await passwordencrypt(
            newPassword,
            user.password
          );

          const userUpdate = await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { password: passwordHash } },
            { new: true }
          );

          return res.status(200).json({
            status: StatusCodes.OK,
            userUpdate,
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
};
exports.forgotpassword = async (req, res) => {
  try {
    const {email, newpassword, confirmpassword} = req.body

    if(!email || !newpassword || !confirmpassword){
      return res.status(403).json({
        status:StatusCodes.FORBIDDEN,
        message:"All filed required"
      })
    }else if (!validatePassword(newpassword)){
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: MessageRespons.passwordvalidate,
      })
    } else{
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User details not found",
      });
    } else {
      if (newpassword !== confirmpassword) {
        return res.status(400).json({
          status: 400,
          message: "Password not match",
        });
      } else if (
        user.otpExpire <
        new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
      ) {
        return res.status(400).json({
          status: 400,
          message: "Otp session time out",
        });
      } else {
        const passwordHash = await passwordencrypt(newpassword);
        const updateUser = await User.findByIdAndUpdate(
          { _id: user._id },
          { $set: { otp: null, password: passwordHash, otpExpire: null } },
          { new: true }
        );
        console.log(user.otpExpire);
        // user.password = passwordHash;
        // await user.save();

        return res.status(200).json({
          status: 200,
          message: "Password successfully change",
        });
      }
      // }
    }
  }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: MessageRespons.internal_server_error,
    });
  }
};
exports.SendOtpEmail = async (req, res) => {
  try {
    let { email } = req.body;
    const otp = Math.floor( Math.random().toFixed(4) * 9000);
    if (!email) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Enter your email id",
      });
    } else {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          status: StatusCodes.BAD_REQUEST,
          message: "We check email id not found in our database",
        });
      } 
      // else {
      //   let EmailResponse = await SendEmail(user.email, otp);

      //   if (EmailResponse.error) {
      //     return res.status(503).json({
      //       status: StatusCodes.SERVICE_UNAVAILABLE,
      //       message: "couldn't send email, Please try later",
      //     });
      //   } 
        else {
          

          let expirytime = Date.now() + 2 * 60 * 1000;
          let expirytimeIST = new Date(expirytime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          const userOtpExpiry = await User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { otp: otp, otpExpire: expirytimeIST } },
            { new: true }
          );
     
        }
        
      }
      return res.status(200).json({
        status: StatusCodes.OK,
      
       otp:otp,
        message: "We send Email for OTP",
      });
    // }
  } catch (error) {
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: MessageRespons.internal_server_error,
    });
  }
};

// exports.SendOtpEmail = async (req, res) => {
//   try {
//     let { email } = req.body;
//     const otp = Math.floor(Math.random() * 9000); // Fix the random number generation
    
//     if (!email) {
//       return res.status(400).json({
//         status: StatusCodes.BAD_REQUEST,
//         message: "Enter your email id",
//       });
//     } else {
//       let user = await User.findOne({ email });

//       if (!user) {
//         return res.status(400).json({
//           status: StatusCodes.BAD_REQUEST,
//           message: "Email not found in our database",
//         });
//       } else {
//         let expirytime = Date.now() + 2 * 60 * 1000; // Fix the calculation
//         let expirytimeIST = new Date(expirytime).toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         });
//         const userOtpExpiry = await User.findByIdAndUpdate(
//           { _id: user._id },
//           { $set: { otp: otp, otpExpire: expirytimeIST } },
//           { new: true }
//         );
//         const { error, token } = await TokenGenerate({
//           // _id: user._id,
//           email: user.email,
//           role: user.role, // Assuming you have a 'role' property in your user object
//         });
//         if (error) {
//           return res.status(400).json({
//             status: StatusCodes.BAD_REQUEST,
//             message: "Couldn't generate a token, please try later",
//           });
//         } else {
//           // Send the OTP email using SendEmail function
//           // let EmailResponse = await SendEmail(user.email, otp);

//           // if (EmailResponse.error) {
//           //   return res.status(503).json({
//           //     status: StatusCodes.SERVICE_UNAVAILABLE,
//           //     message: "Couldn't send email, please try later",
//           //   });
//           // }

//           return res.status(200).json({
//             status: StatusCodes.OK,
//             success: true,
//             otp: otp,
//             accesstoken: token,
//             message: "Login success",
//           });
//         }
//       }
//     }
//   } catch (error) {
//     return res.status(500).json({
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//       message: "Internal server error",
//     });
//   }
// };


exports.uploadfile = async (req, res) => {};
