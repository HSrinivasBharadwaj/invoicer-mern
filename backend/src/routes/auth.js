const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidateSignUpData, ValidateLoginData } = require('../utils/validate');
const authRouter = express.Router();

//Post Request for signup
authRouter.post("/auth/signup",async(req,res) => {
    await ValidateSignUpData(req.body)
    try {
        const {email,password,name,address,businessName}=req.body;
        const findExistingUser = await User.findOne({email:email});
        if (findExistingUser) {
            return res.status(400).json({message: "User with email already exists, please choose different one"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User({
            email,
            password: hashedPassword,
            name,
            address,
            businessName
        })
        const savedUser = await newUser.save();
        const {password:_,...userData} = savedUser.toObject();
        return res.status(201).json({message: "User successfully created",data:userData})
    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message: "Internal Server Error"})
    }
})

//Post Request for login
authRouter.post("/auth/login",async(req,res) => {
    await ValidateLoginData(req.body);
    try {
        const {email,password} = req.body;
        const findExistingUser = await User.findOne({email:email});
        if (!findExistingUser) {
            return res.status(404).json({message: "User not found."})
        }
        const isPasswordValid = await bcrypt.compare(password,findExistingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid Password"})
        }
        const { password:_,...userData } = findExistingUser.toObject();
        const token = await jwt.sign(userData,process.env.SECRET,{
            expiresIn: "1h"
        })
        const cookieOptions = {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        }
        res.cookie("token",token,cookieOptions)
        return res.status(200).json({ message: "Login successful", data: userData });
    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message: "Internal Server Error"})
    }
})

//Logout Route
authRouter.post("/auth/logout",async(req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "User Logged out successfully"})
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = authRouter