import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import ErrorHandler from "../middlewares/error.js";
import { Blog } from "../models/blogSchema.js";

export const blogPost = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Blog Main Images Is Mandotory!", 400));
  }

  const {
    mainImage,
    paragraphOneIamge,
    paragraphTwoIamge,
    paragraphThreeIamge,
  } = req.files;

  if (!mainImage) {
    return next(new ErrorHandler("Blog Main Images Is Mandotory!", 400));
    const allowedFormats = ["image/jpg", "image/jpeg", "image/webp"];
    if (
      !allowedFormats.includes(mainImage.mimetype) ||
      (paragraphOneIamge &&
        !allowedFormats.includes(paragraphOneIamge.mimetype)) ||
      (paragraphTwoIamge &&
        !allowedFormats.includes(paragraphTwoIamge.mimetype)) ||
      (paragraphThreeIamge &&
        !allowedFormats.includes(paragraphThreeIamge.mimetype))
    ) {
      return next(
        ErrorHandler(
          "Inavlid File Type, Only JPG ,PNG,WEBP Formats are Allowed",
          400
        )
      );
    }
  }
  const {
    title,
    intro,
    paragraphOneTitle,
    paragraphOnedesc,
    paragraphTwodesc,
    paragraphTwoTitle,
    paragraphThreedesc,
    paragraphThreeTitle,
    category,
  } = req.body;

  const createdBy = req.user_id;
  const authorName = req.user.name;
  const authorAvatar = req.user.avatar.url;

  if (title || !category || !intro) {
    return new ErrorHandler("Title,Intro and Category Are Required Feilds");
  }

  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paragraphOneIamge
      ? cloudinary.uploader.upload(paragraphOneIamge.tempFilePath)
      : Promise.resolve(null),
    paragraphTwoIamge
      ? cloudinary.uploader.upload(paragraphTwoIamge.tempFilePath)
      : Promise.resolve(null),
    paragraphThreeIamge
      ? cloudinary.uploader.upload(paragraphThreeIamge.tempFilePath)
      : Promise.resolve(null),
  ];

  const [
    mainImageRes,
    paragraphOneIamgeRes,
    paragraphTwoIamgeRes,
    paragraphThreeIamgeRes,
  ] = await Promise.all(uploadPromises);

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (paragraphOneIamge &&
      (!paragraphOneIamgeRes || paragraphOneIamgeRes.error)) ||
    (paragraphTwoIamge &&
      (!paragraphTwoIamgeRes || paragraphTwoIamgeRes.error)) ||
    (paragraphThreeIamge &&
      (!paragraphThreeIamgeRes || paragraphThreeIamgeRes.error))
  ) {
    return next(new ErrorHandler("Error Occured While Uploading One or More Images",500))
  }
  const blogData = {
    title,
    intro,
    paragraphOneTitle,
    paragraphOnedesc,
    paragraphTwodesc,
    paragraphTwoTitle,
    paragraphThreedesc,
    paragraphThreeTitle,
    category,
    createdBy,
    authorName,
    authorAvatar,
    mainImage:{
        public_id:mainImageRes.public_id,
        url:mainImageRes.secure_url,
    }
  }
  if (paragraphOneIamgeRes) {
    blogData.paragraphOneIamge ={
        public_id:paragraphOneIamgeRes.public_id,
        url: paragraphOneIamgeRes.secure_url,
    }
  }
  if (paragraphTwoIamgeRes) {
    blogData.paragraphTwoIamge ={
        public_id:paragraphTwoIamgeRes.public_id,
        url: paragraphTwoIamgeRes.secure_url,
    }
  }
  if (paragraphThreeIamgeRes) {
    blogData.paragraphOneIamge ={
        public_id:paragraphThreeIamgeRes.public_id,
        url: paragraphThreeIamgeRes.secure_url,
    }
  }
  const blog = await Blog.create(blogData);
  res.status(200).json({
    success:true,
    message:"Blog Created Upload",
    blog
  })
});
