const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");

require("../controllor/UserControllor");

const { jwt_secretkey, jwt_secretkey_student, jwt_secretkey_refresh } = process.env;

const UserToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(authHeader, jwt_secretkey);
    req.decodeduser = decoded;
  } catch (error) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized:Invalid token",
    });
  }
  return next();
};

const StudentToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(authHeader, jwt_secretkey_student);
    req.decodedstudent = decoded;
  } catch (error) {
    return res.status(403).json({
      status: StatusCodes.FORBIDDEN,
      message: "Unauthorized:Invalid token",
    });
  }
  return next();
};
const blockTokens = new Set();

const restrict = (...role) => {
  return (req, res, next) => {
    const user = req.decodeduser.role;
    const UserAllow = role.some((role) => user.includes(role));
    if (UserAllow) {
      next();
    } else {
      return res.status(403).json({
        status: StatusCodes.FORBIDDEN,
        message: "You do not have permission",
      });
    }
  };
};

module.exports = {
  UserToken,
  blockTokens,
  restrict,
  StudentToken,
};
