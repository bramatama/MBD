import express from "express"

import { db } from "../../config/db.js"

const router = express.Router()

// logout
router.delete("/Logout", (req, res) => {
    res.cookie(
        "token",
        "",
        {
            maxAge: 0
        }
    )

    res.json({
        message: "Berhasil logout"
    })
})

// history
router.get("/peminjaman", (req, res) => {
    const username = req.query.username
    const payload = res.locals.payload

    if (username){
        if(payload.tipe != 'pegawai'){
            return res
                .status(401)
                .json({
                    message : "Anda tidak memiliki akses untuk halaman ini"
                })
        }
        db.query("call LihatHistorybyUsername(?)",[username], (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: err.message,
                });
            }
    
            const queryResult = result [0]
    
            return res
                .status(200)
                .json({
                    message: "History Peminjaman dari " + username,
                    data: queryResult
                })
        })
    }
    else{
        if (payload.tipe != 'pegawai'){
            db.query("call LihatHistorybyID(?)", [payload.user_id], (err, result) => {
                if (err) {
                    return res.status(500)
                    .json ({
                        message : "Internal server error",
                        error : err.message
                    })
                }
        
                const queryResult = result[0]
                return res
                .status(200)
                .json({
                    message: "Berikut History Peminjaman Anda",
                    data: queryResult
                })
            })
        }
        else{
            db.query("call LihatSemuaHistory()", (err, result) => {
            if (err) {
                return res.status(500)
                .json({
                    message: "Internal Server Error",
                    error: err.message,
                })
            }

            const queryResult = result [0]

            return res
                .status(200)
                .json({
                    message: "Semua History Peminjaman",
                    data: queryResult
                })
            })
        }
    }
    
})

export {router as authRouter}