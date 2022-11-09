import {Request, Response} from "express"

import Users from "../moduls/userModule"

import {IReqAuth} from "../config/interface";


const userCtrl = {
    updateUser: async (req: IReqAuth, res: Response) => {
        if (!req.user) return res.status(400).json({msg: "Invalid Authorization"})
        try {
            const {avatar, name} = req.body

            const user = await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, name
            })

            res.json({msg: "Update Success!", user})
        } catch (err) {

        }
    }
}
export default userCtrl