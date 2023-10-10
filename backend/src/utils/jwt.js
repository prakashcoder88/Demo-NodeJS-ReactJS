const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid")
require("dotenv").config();
require("../models/user")
require("../controllor/UserControllor")
const { jwt_secretkey,jwt_secretkey_student,jwt_secretkey_refresh } = process.env;

const options = {
  expiresIn: "24h",
};
// const Refreshoptions = {
//   expiresIn: "2d",
// }; 

async function TokenGenerate({_id,role,email}) {
  
  try {
    const payload = { _id, role, email};
    const token = await jwt.sign(payload, jwt_secretkey, options);
    // const refreshtokenId = uuidv4();
    // const refreshtoken = await jwt.sign({refreshtokenId},jwt_secretkey_refresh, Refreshoptions) 
    return { error: false, token}; //refreshtoken 
  } catch (error) {
    return { error: true };
  }

}

async function TokenGenerateStudent({_id}) {
  
  try {
    const payload = { _id };
    const token = await jwt.sign(payload, jwt_secretkey_student, options);
    return { error: false, token };
  } catch (error) {
    return { error: true };
  }

}


module.exports = {
    TokenGenerate,
    TokenGenerateStudent
}
