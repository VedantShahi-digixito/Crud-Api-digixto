const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRETKEY = "Notesapi";

const userTable = require("../models/index.js").User;

//Signup Api
const Signup = async (req, resp) => {
  const { user_id, firstName, lastName, email, password } = req.body;
  try {
    const existinguser = await userTable.findOne({ where: { email: email } });

    if (existinguser) {
      return resp.status(400).json({ message: "User Already Exist" });
    }
    const hashpasswd = await bcrypt.hash(password, 10);
    const result = await userTable.create({
      user_id: user_id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashpasswd,
    });

    const token = jwt.sign(
      { user_id: result.user_id, password: result.password },
      SECRETKEY
    );
    return resp.status(200).json({
      messsage: "User Successfully Registered",
      user: result,
      token: token,
    });
  } catch (error) {
    console.error(error);
  }
};

//Signin Api
const Signin = async (req, resp) => {
  const email = req.email;
  const password = req.password;
  try {
    const existinguser = await userTable.findOne({ where: { email: email } });
    if (!existinguser) {
      return resp.status(404).json({ message: " User Not Found" });
    }
    const matchpassword = await bcrypt.compare(password, existinguser.password);

    if (!matchpassword) {
      return resp.status(400).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { email: existinguser.email, password: existinguser.password },
      SECRETKEY,
      { expiresIn: "600s" }
    );
    return resp
      .status(200)
      .json({ message: "Successfully Logged In", token: token });
  } catch (error) {
    console.error(error);
  }
};

//Get Details Api
const GetDetails = async (req, resp) => {
  const data = await userTable.findAll();
  resp.send(data);
};

//Modify Api
const Modify = async (req, resp) => {
  jwt.verify(req.token, SECRETKEY, async (error, authdata) => {
    if (error) {
      resp.send("Token Not verified");
    } else {
      const { email, password } = req.body;
      try {
        const existinguser = await userTable.findOne({
          where: { email: email },
        });
        if (!existinguser) {
          return resp.status(404).json({ message: " User Not Found" });
        }
        const matchpassword = await bcrypt.compare(
          password,
          existinguser.password
        );

        if (!matchpassword) {
          return resp.status(400).json({ message: "Invalid Credentials" });
        }

        const data = await userTable.update(
          { lastName: req.body.lastName, firstName: req.body.firstName },
          {
            where: {
              email: email,
            },
          }
        );
        return resp
          .status(200)
          .json({ message: "Data updated with email id", email: email });
      } catch (error) {
        console.error(error);
      }
    }
  });
};

//Delete api
const Del = async (req, resp) => {
  jwt.verify(req.token, SECRETKEY, async (error, authdata) => {
    if (error) {
      resp.send(req.token);
    } else {
      const { email, password } = req.body;
      try {
        const existinguser = await userTable.findOne({
          where: { email: email },
        });
        if (!existinguser) {
          return resp.status(404).json({ message: " User Not Found" });
        }
        const matchpassword = await bcrypt.compare(
          password,
          existinguser.password
        );

        if (!matchpassword) {
          return resp.status(400).json({ message: "Invalid Credentials" });
        }
        const data = await userTable.destroy({ where: { email: email } });
        return resp
          .status(200)
          .json({ message: "User Deleted with Email", email: email });
      } catch (error) {
        console.error(error);
      }
    }
  });
};

module.exports = {
  Signup,
  Signin,
  GetDetails,
  Modify,
  Del,
};
