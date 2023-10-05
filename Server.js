const express = require("express");
const app = express();
const sequelize = require("sequelize");
const {
  Signup,
  Signin,
  GetDetails,
  Modify,
  Del,
} = require("./controllers/Usercontrollers.js");
var bodyParser = require("body-parser");
const db = require("./models/index.js");
const routes = require("./routes/routes.js");
const {
  verifyToken,
  verifyUsernamePasswd,
} = require("./middlewares/LoginandTokenCheck.js");
db.sequelize.sync();

app.use(express.json());

app.use((req, res, next) => {
  res.header("X-XSS-Protection", "1; mode=block");
  res.header("X-Frame-Options", "deny");
  res.header("X-Content-Type-Options", "nosniff");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE , HEAD , OPTIONS"
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization, X-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/server", (req, rres) => {
  console.log(req.body);
});

app.post("/Signin", verifyUsernamePasswd, Signin);
app.get("/GetDetails", GetDetails);

app.post("/Signup", Signup);

app.put("/Modify", verifyToken, Modify);

app.delete("/:id", verifyToken, Del);

app.listen(3200, () => {
  console.log("Server is running on 3200 port");
});
