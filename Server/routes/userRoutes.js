import express from "express";
import { getMyProfile, login, logout, register } from "../controllers/UserController.js";
import { isAuthenticated,  } from "../middlewares/auth.js";

const router = express.Router()


router.post('/register',register)
router.post('/login',login)
router.get('/logout',isAuthenticated, logout)
router.get('/myprofile',  isAuthenticated,   getMyProfile)


export default router;