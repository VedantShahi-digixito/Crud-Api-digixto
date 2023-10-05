const Buffer = require("buffer").Buffer;

//Token Verfication Middleware
verifyToken = (req, resp, next) => {
  const bearerheader = req.headers["authorization"];
  if (typeof bearerheader !== "undefined") {
    const bearer = bearerheader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    resp.send("Token Not Recongnize");
  }
};

//Verify User Middleware
verifyUsernamePasswd = (req, resp, next) => {
  const basicheader = req.headers["authorization"];
  if (typeof basicheader !== "undefined") {
    const header = basicheader.split(" ");
    const token = header[1];
    const decodedString = Buffer.from(token, "base64").toString();
    const data = decodedString.split(":");
    req.email = data[0];
    req.password = data[1];
    console.log(req.email);
    console.log(req.password);
    next();
  } else {
    resp.send("No Credentials Recongnise");
  }
};

module.exports = { verifyToken, verifyUsernamePasswd};
