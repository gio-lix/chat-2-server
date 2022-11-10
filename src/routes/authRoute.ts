import express from "express"
import authCtrl from "../controllers/authCtrl";
import {validRegister} from "../middleware/valid"

const router = express.Router()

router.get("/refresh_token", authCtrl.refreshToken)
router.post("/google_token", authCtrl.googleLogin)
router.post("/register", validRegister, authCtrl.register)

router.post("/login", authCtrl.login)
router.get("/logout", authCtrl.logout)

export default router
