import {Request, Response} from "express"
import Users from "../moduls/userModule"
import bcrypt from "bcrypt"
import {generateAccessToken, generateActiveToken, generateRefreshToken} from "../config/generateToken"
import {IDecodedToken, IUser} from "../config/interface";
import jwt from "jsonwebtoken";


const authCtrl = {
    register: async (req: Request, res: Response) => {
        try {

            const {name, account, password} = req.body

            const user = await Users.findOne({account})
            if (user) return res.status(400).json({msg: "Email or Phone number already exists."})

            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = new Users({
                name, account, password: passwordHash
            })

            const active_token = generateActiveToken({newUser})

            await newUser.save()

            res.json({
                status: "OK",
                msg: "Register successfully",
                data: newUser,
                active_token
            })
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req: Request, res: Response) => {
        try {
            const {account, password} = req.body

            const user = await Users.findOne({account})
            if (!user) return res.status(400).json({msg: "This account does not exits"})

            loginUser(user, password, res)
        } catch (err: any) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req: Request, res: Response) => {
        try {
            res.clearCookie("refreshtoken", { path: `/api/refresh_token` })
            return res.json({msg: "logged out!"})
        } catch (err: any) {

        }
    },
    refreshToken: async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken


            if (!rf_token) return res.status(400).json({msg: "Please login now!"})

            const decoded = <IDecodedToken>jwt.verify(rf_token, `${process.env.ACTIVE_REFRESH_SECRET}`)
            if (!decoded.id) return res.status(400).json({msg: "Please login now!"})

            const user = await Users.findById(decoded.id).select("-password")

            if (!user)  return res.status(400).json({msg: "This account does not exist."})

            const access_token = generateAccessToken({id: user._id})


            res.json({access_token, user})
        } catch (err: any) {

        }
    }
}


const loginUser = async (user:IUser, password: string,res: Response) => {
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(500).json({msg: "Password is incorrect."})

    const access_token = generateAccessToken({id: user._id})
    const refresh_token = generateRefreshToken({id: user._id})

    res.cookie('refreshtoken', refresh_token, {
        sameSite: 'strict',
        httpOnly: true,
        path: `/api/refresh_token`,
        maxAge: 30*24*60*60*1000 // 30days
    })

    res.json({
        msg: 'Login Success!',
        access_token,
        user: { ...user._doc, password: '' }
    })

}


export default authCtrl
