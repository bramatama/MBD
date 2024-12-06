import express from "express"

import { jwt } from "../../config/jwt.js"
import { db } from "../../config/db.js"

const router = express.Router()


// daftar
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


// login
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
                data : queryResult
            })
    })
})


// buku
router.get("/buku", (req, res) => {
    const judul = req.query.judul
    const kategori = req.query.kategori

    if (kategori) {
        if (judul) {
            db.query("call CariBukudanKategori(?,?)", [kategori, judul], (err, result) => {
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
                        message: `Buku dengan kategori ${kategori}, Search Bar ${judul}`,
                        data: queryResult
                    })
            })
        }
        else{
            db.query("call LihatBukubyKategori(?)", [kategori], (err,result) => {
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
                        message: `Semua Buku dengan kategori ${kategori}`,
                        data: queryResult
                    })
            })
        }
    }
    else if (judul) {
        db.query("call CariBuku(?)", [judul], (err, result) => {
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
                    message: `Search bar ${judul}`,
                    data: queryResult
                })
        })
    }
    else{
        db.query("call LihatSemuaBuku()",(err, result) => {
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
                    message: `Semua Buku`,
                    data: queryResult
                })
        })
    }
})

router.get("/buku/:id_buku", (req,res) => {
    const id_buku = req.params.id_buku
    
    if (!Number(id_buku)){
        return res
            .status(400)
            .json({
                message : "id tidak valid"
            })
    }
    db.query("CALL BukubyID(?)", [id_buku], (err,result) => {
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
                message: `Berikut Buku yang anda Pilih`,
                data: queryResult
            })
    })
})

export {router as nonAuthRouter}