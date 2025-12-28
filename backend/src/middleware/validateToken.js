const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ValidateToken = async (req, res, next) => {
  try {
    const cookies = req.cookies
    const { token } = cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isTokenValid = await jwt.verify(token, process.env.SECRET);
    const { _id } = isTokenValid;
    const loggedInUser = await User.findById({ _id });
    if (!loggedInUser) {
      throw new Error("User doesn't found");
    }
    req.user = loggedInUser;
    next();
  } catch (error) {
    console.log("error", error);
    return res.status(500).send("Failed to authenticate the user");
  }
  
};

module.exports = ValidateToken;
