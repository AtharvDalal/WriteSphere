import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";


export const register = catchAsyncErrors(async (req,res,next)=>{
     try {
         const {name,email,phone,role,education,pasword} = req.body
         if (!name || !email || !phone || !role || !education || !pasword) {
                  return next(new ErrorHandler("Please Provide Full Deatils",400))
         }
         const user = await User.findOne({email})
         if (user) {
            return next(new ErrorHandler("User already Exist",400))
         }
         await User.create({
           name,email,phone,role,education,pasword
         });
         res.status(200).json({
           success:true,
           msg:"User Registerd SuccessFull"
         })
     } catch (error) {
        return res.status(400).json({
            success:true,
            msg:"Error In User Register API"
        })
     }
})