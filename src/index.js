import express from 'express'
import cookieParser from 'cookie-parser'

import { jwt } from './config/jwt.js'
import {authRouter} from './router/Auth/index.js'
import {nonAuthRouter} from './router/Non Auth/index.js'

const app = express()

app.use(express.json())

app.use(cookieParser())

app.use(nonAuthRouter)

app.use((req, res, next) => {
    const token = req.cookies.token
    const payload = jwt.verify(token)

    if (!payload) {
        res
            .status(401)
            .json({
                message: "Unauthorized",
            })

        return
    }

    res.locals.payload = payload

    next()
})

app.use(authRouter)

app.listen(4000, () => {
    console.log(`Server listening on port 4000`)
})