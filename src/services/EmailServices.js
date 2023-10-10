const nodemailer = require("nodemailer");
const transpoter = require("../config/EmailConfig");
// const {otp} = require("../services/CommonServices")
require("../models/user");

async function SendEmail(email, otp) {
  try {
    let mailSend = {
      from: "demonodejs@outlook.com",
      to: email,
      subject: "Send forgot password otp in your mail id",
      text: `Send forgot password otp in your mail id, You Opt is here: ${otp}`,
    };
    let info = await transpoter.sendMail(mailSend);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Can't be send email",
    };
  }
}


module.exports = SendEmail
