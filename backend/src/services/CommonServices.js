const bcrypt = require("bcrypt")
const { StatusCodes } = require("http-status-codes");

const User = require("../models/user")


async function passwordencrypt(password) {

        let salt = await bcrypt.genSalt(10)
        let passwordHash = bcrypt.hash(password, salt)
        return passwordHash
}

function validatePassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$&%])[A-Za-z\d@#$&%]{6,16}$/;
  return pattern.test(password);
}

// const otp = Math.floor( Math.random().toFixed(4) * 9000);

const VerifyOTP = async (req, res) => {
  let { email, otp } = req.body;

  try {
    const user =
      (await User.findOne({ email })) 
      // (await adminuser.findOne({ empEmail }));

    if (!user) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    } else if (otp !== user.otp) {
      return res.status(400).json({
        statust: StatusCodes.BAD_REQUEST,
        message: "Otp not match",
      });
    } else if (
      user.otpExpire  <
        new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })
    ) {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: "Otp time Expired",
      });
    } else {
      return res.status(200).json({
        status: StatusCodes.OK,
        message: "Otp successfully verify",
      });
    }
  } catch (error) {

    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
  }
};

module.exports = {
    passwordencrypt,
    validatePassword,
    // otp,
    VerifyOTP

}