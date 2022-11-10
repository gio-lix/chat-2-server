import express from "express"
import auth from "../middleware/auth";
import userCtrl from "../controllers/userCtrl";
const router = express.Router()

router.put("/user", auth, userCtrl.updateUser)
router.put("/reset_password", auth, userCtrl.updatePassword)


export default router