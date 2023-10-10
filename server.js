const express = require("express");
const cors = require("cors")
const app = express();
const bodyparser = require("body-parser");

const PORT = process.env.PORT || 5000;

require("./src/config/Db.Config.js");
const userRoute = require("./src/routes/UserRoutes.js");
const studentRoute = require("./src/routes/StudentRoutes.js")


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/student", studentRoute)

app.listen(PORT, () => {
  console.log(`Server Successfully Connected port no ${PORT}`);
});
