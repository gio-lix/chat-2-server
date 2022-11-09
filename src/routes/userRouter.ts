import express from "express"
import auth from "../middleware/auth";
import authCtrl from "../controllers/authCtrl";
import {validRegister} from "../middleware/valid"
import userCtrl from "../controllers/userCtrl";
const router = express.Router()

router.put("/user", auth, userCtrl.updateUser)


export default router