import express from "express"

import { jwt } from "../../config/jwt.js"
import { db } from "../../config/db.js"

const router = express.Router()

router.post('/daftar', (req, res) => {
    const body = req.body

    const data = [
        body.username,
        body.password,
        body.nama,
        body.tipe,
    ]

    db.query("call Daftar(?, ?, ?, ?)", data, (err, _result) => {
        if (err) {
            const sqlErrorCode = err.sqlState

            const sqlClientErrors = [
                "23000",
                "45000"
            ]

            if (!sqlClientErrors.includes(sqlErrorCode)) {
                return res
                    .status(500)
                    .json({
                        message: "Internal Server Error",
                        error: err.message
                    })
            }

            return res
                    .status(400)
                    .json({
                        message: err.message
                    })
        }

        return res
            .status(201)
            .json({
                message: "Register akun berhasil"
            })
    })
})

router.post("/login", (req, res) => {
    const body = req.body

    const data = [
        body.username,
        body.password,
    ]

    db.query("call Login(?, ?)", data, (err, result) => {
        if (err) {
            const sqlErrorCode = err.sqlState

            const sqlClientErrors = [
                "23000",
                "45000"
            ]

            if (!sqlClientErrors.includes(sqlErrorCode)) {
                return res
                    .status(500)
                    .json({
                        message: "Internal Server Error",
                        error : err.message
                    })
            }

            return res
                    .status(400)
                    .json({
                        message: err.message
                    })
        }

        const queryResult = result[0][0]

        res.cookie(
            "token",
            jwt.sign(queryResult),
            {
                maxAge: 3_600 * 1000
            }
        )

        return res
            .status(200)
            .json({
                message: "Login berhasil",
            })
    })
})

export {router as nonAuthRouter}