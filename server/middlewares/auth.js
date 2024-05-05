const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async(req,res,next) =>{
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing",
            });
        }
        //verify token
        try{
            // console.log("token",token)
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            // console.log("decode",decode)
            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
        });
    }
};

//isStudent
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for students only",
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User cannot be verified",
        });
    }
};
//isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor only",
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User cannot be verified",
        });
    }
};
//isAdmin
exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only",
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"User cannot be verified",
        });
    }
};