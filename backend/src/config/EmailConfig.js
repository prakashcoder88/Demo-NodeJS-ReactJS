const nodemailer = require("nodemailer")

require("../models/user")

const {auth_username, auth_password, HOST, PORT} = process.env


let transport = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth:{
        user:auth_username,
        pass:auth_password
    }

})

module.exports = transport;