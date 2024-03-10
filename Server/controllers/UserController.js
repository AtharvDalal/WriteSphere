import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


export const register = catchAsyncErrors(async (req,res,next)=>{
    
         const {name,email,phone,role,education,password} = req.body
         if (!name || !email || !phone || !role || !education || !password) {
                  return next(new ErrorHandler("Please Provide Full Deatils",400))
         }
         let userexist = await User.findOne({email})
         if (userexist) {
            return next(new ErrorHandler("User already Exist",400))
         }
       userexist =   await User.create({
           name,email,phone,role,education,password
         });
         sendToken(userexist,200, "User Registered Successfully",res)
      
     
})

export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email, password, role} = req.body

    if (!email || !password || !role) {
       return next(new ErrorHandler("Please Provide Full Credentials ",400))
    }

    const user = await User.findOne({email}).select("+password")
    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password ",400))
    }
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Email or Password",400))
    }
    if (user.role !== role) {
      return next(new ErrorHandler(`User Provided Role ${role} not found`,400))
    }
    sendToken(user,200, "User Login Successfully",res)
    

    
})