const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcrypt');
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }
    const token = crypto.randomUUID();
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      {
        new: true,
      }
    );
    const url = `http://localhost:3000/update-password/${token}`;
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link:${url}`
    );
    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while generating the token for reset Password",
    });
  }
};

//resetPassword
exports.resetPassword = async(req,res) => {
    try{
        const {password,confirmPassword,token} = req.body;
        if(password !== confirmPassword){
            return res.status(401).json({
                success:false,
                message:"Password not matching",
            });
        }
        const userDetails = await User.findOne({token:token});
        if(!userDetails){
            return res.status(401).json({
                success:false,
                message:"Token not found||invalid",
            });
        }
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success:false,
                message:"Token expired,Please regenerate token",
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        return res.status(200).json({
            success:true,
            message:"Password reset success",
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while reset Password",
          });
    }
}
