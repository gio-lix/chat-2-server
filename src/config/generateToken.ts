import jwt from "jsonwebtoken"

export const generateActiveToken = (payload: object) => {
    return jwt.sign(
        payload,
        `${process.env.ACTIVE_TOKEN_SECRET}`,
        {expiresIn: "5m"}
    )
}

export const generateAccessToken = (payload: object) => {
    return jwt.sign(
        payload,
        `${process.env.ACTIVE_SECRET_SECRET}`,
        {expiresIn: "15m"}
    )
}

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(
        payload,
        `${process.env.ACTIVE_REFRESH_SECRET}`,
        {expiresIn: "30d"}
    )
}