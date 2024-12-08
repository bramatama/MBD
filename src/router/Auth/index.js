import express from "express"

import { db } from "../../config/db.js"

const router = express.Router()

// logout
router.delete("/auth/logout", (req, res) => {
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

// pinjam buku
router.post("/peminjaman", (req,res) => {
    // const url = window.location.pathname; // misal /buku/2
    // const id_buku = url.split('/')[2] // 2
    const payload = res.locals.payload
    const body = req.body

    const data = [
        payload.user_id,
        body.id_buku
    ]

    if (payload.tipe != 'member'){
        return res
            .status(401)
            .json({
                message : "Hanya member yang dapat meminjam buku!"
            })
    }
    db.query("call PinjamBuku(?,?)", data, (err, result) => {
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

        const queryResult = result[0]

        return res
            .status(200)
            .json({
                message : "Peminjaman berhasil dilakukan",
                data : queryResult
            })
    })
})

// kembalikan
router.put("/peminjaman/:id_peminjaman", (req, res) => {
    const id_peminjaman = req.params.id_peminjaman
    const payload = res.locals.payload

    if (!Number(id_peminjaman)){
        return res
            .status(400)
            .json({
                message : "id tidak valid"
            })
    }
    if(payload.tipe != 'pegawai'){
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk halaman ini"
            })
    }
    db.query('CALL KembalikanBuku(?)', [id_peminjaman], (err,result) => {
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
        const queryResult = result[0]

        return res
            .status(200)
            .json({
                message: "Buku Berhasil Dikembalikan",
                data: queryResult
            })
    })
})

// tambah buku
router.post("/buku", (req,res) => {
    const body = req.body
    const payload = res.locals.payload

    const data = [
        body.judul,
        body.penulis,
        body.penerbit,
        body.tahun_terbit,
        body.kategori,
        body.stok
    ]

    if(payload.tipe != 'admin'){
        return res
            .status(401)
            .json({
                message : 'Anda tidak memiliki akses untuk fungsi ini'
            })
    }
    else{
        db.query('call TambahBukuBaru(?,?,?,?,?,?)', data, (err,result) => {
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

            return res
                .status(200)
                .json({
                    message : 'Buku berhasil ditambahkan',
                    data : queryResult
                })
        })
    }
})

// edit data buku
router.patch("/buku/:id_buku", (req,res) => {
    const id_buku = req.params.id_buku
    const payload = res.locals.payload
    const body = req.body

    if(!Number(id_buku)){
        return res
            .status(400)
            .json({
                message : "id tidak valid"
            })
    }

    const data = [
        id_buku,
        body.judul_pengganti,
        body.penulis_pengganti,
        body.penerbit_pengganti,
        body.tahun_terbit,
        body.kategori_pengganti
    ]

    if(payload.tipe != 'admin'){
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk fungsi ini"
            })
    }
    else{
        db.query('call EditDataBuku(?,?,?,?,?,?)', data, (err, result) => {
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

            return res
                .status(200)
                .json({
                    message : 'Buku berhasil diedit',
                    data : queryResult
                })
        })
    }
})

// tambah stok buku
router.patch("/buku/:id_buku/tambah", (req,res) => {
    const id_buku = req.params.id_buku
    const payload = res.locals.payload
    const body = req.body

    if(!Number(id_buku)){
        return res
            .status(400)
            .json({
                message : "id tidak valid"
            })
    }

    const data = [
        id_buku,
        body.stok_tambahan
    ]

    if (payload.tipe != "admin"){
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk fungsi ini"
            })
    }
    else {
        db.query('CALL TambahStokBuku(?,?)', data, (err,result) => {
            if(err){
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

            return res
                .status(200)
                .json({
                    message : 'Stok buku berhasil ditambahkan',
                    data : queryResult
                })
        })
    }
})

// hapus buku
router.delete("/buku/:id_buku", (req,res) => {
    const id_buku = req.params.id_buku
    const payload = res.locals.payload

    if(!Number(id_buku)){
        return res
            .status(400)
            .json({
                message : "id tidak valid"
            })
    }

    if (payload.tipe != "admin"){
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk fungsi ini"
            })
    }
    else {
        db.query('CALL HapusBuku(?)', [id_buku], (err,result) => {
            if(err){
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

            return res
                .status(200)
                .json({
                    message : 'Buku berhasil dihapus',
                    data : queryResult
                })
        })
    }
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
    
            const queryResult = result [0]
    
            return res
                .status(200)
                .json({
                    message: `History Peminjaman dari ${username}`,
                    data: queryResult
                })
        })
    }
    else{
        if (payload.tipe == "member"){
            db.query("call LihatHistorySaya(?)", [payload.user_id], (err, result) => {
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
        
                const queryResult = result[0]
                return res
                .status(200)
                .json({
                    message: "Berikut History Peminjaman Anda",
                    data: queryResult
                })
            })
        }
        else if(payload.tipe == 'pegawai'){
            db.query("call LihatSemuaHistory()", (err, result) => {
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

            const queryResult = result [0]

            return res
                .status(200)
                .json({
                    message: "Semua History Peminjaman",
                    data: queryResult
                })
            })
        }
        else {
            return res
                .status(401)
                .json({
                    message : "Anda tidak memiliki akses untuk halaman ini"
                })
        }
    }
})

// History by ID
router.get("/peminjaman/:id_peminjaman", (req,res) => {
    const id_peminjaman = req.params.id_peminjaman
    const payload = res.locals.payload

    if(!Number(id_peminjaman)){
        return res
            .status(400)
            .json({
                message : "id tidak valid"
            })
    }
    if(payload.tipe != 'pegawai'){
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk halaman ini"
            })
    }
    db.query('CALL LihatHistorybyID(?)', [id_peminjaman], (err,result) => {
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
        const queryResult = result[0]

        return res
            .status(200)
            .json({
                message: "Detail Peminjaman berhasil didapatkan",
                data: queryResult
            })
    })
})

// buat wishlist
router.post("/wishlist", (req,res) => {
    // const url = window.location.pathname; // misal /buku/2
    // const id_buku = url.split('/')[2] // 2
    const payload = res.locals.payload
    const body = req.body

    const data = [
        payload.user_id,
        body.id_buku
    ]

    if (payload.tipe != 'member'){
        return res
            .status(401)
            .json({
                message : "Hanya member yang dapat membuat wishlist!"
            })
    }
    db.query("call BuatWishlist(?,?)", data, (err, result) => {
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

        const queryResult = result[0]

        return res
            .status(200)
            .json({
                message : "Buku berhasil ditambahkan ke wishlist",
                data : queryResult
            })
    })
})

router.get("/wishlist", (req, res) => {
    const payload = res.locals.payload

    if (payload.tipe == 'member'){
        db.query("call LihatWishlistSaya(?)", [payload.user_id], (err, result) => {
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
    
            const queryResult = result[0]
            return res
            .status(200)
            .json({
                message: "Berikut Daftar Wishlist Anda",
                data: queryResult
            })
        })
    }
    else if (payload.tipe == 'pegawai') {
        db.query("call LihatSemuaWishlist()", (err, result) => {
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

        const queryResult = result [0]

        return res
            .status(200)
            .json({
                message: "Daftar Semua Wishlist",
                data: queryResult
            })
        })
    }
    else {
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk halaman ini"
            })
    }
})

// hapus wishlist 
router.delete("/wishlist/:id_buku", (req,res) => {
    const id_buku = req.params.id_buku
    const payload = res.locals.payload

    if (payload.tipe != 'member'){
        return res 
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk fungsi ini"
            })
    }
        if (!Number(id_buku)){
            return res
                .status(400)
                .json({
                    message : "id tidak valid"
                })
        }
        const data = [
            payload.user_id,
            id_buku            
        ]
        db.query('CALL HapusWishlistbyBuku(?,?)', data, (err,result) => {
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
    
            const queryResult = result [0]
    
            return res
                .status(200)
                .json({
                    message: "Wishlist Buku ini sudah dihapus",
                    data: queryResult
                })
        })    
})

router.delete("/wishlist", (req,res) => {
    const payload = res.locals.payload

    if (payload.tipe != 'member') {
        return res
            .status(401)
            .json({
                message : "Anda tidak memiliki akses untuk fungsi ini"
            })
    }
    db.query('CALL HapusSemuaWishlistSaya(?)', [payload.user_id], (err,result) => {
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

        return res
            .status(200)
            .json({
                message: "Berhasil menghapus semua wishlist",
            })
    })
})

export {router as authRouter}