const express = require("express");
const ValidateToken = require("../middleware/validateToken");
const profileRouter = express.Router();

//View Profile
profileRouter.get("/view/profile", ValidateToken, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const safeUser = {
      id: loggedInUser._id,
      name: loggedInUser.name,
      email: loggedInUser.email,
      businessName: loggedInUser.businessName || null,
      address: loggedInUser.address || null,
      createdAt: loggedInUser.createdAt,
    };
    return res.status(200).json({user: safeUser})
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//Need to Add Update User Profile and Update Password

module.exports = profileRouter;
