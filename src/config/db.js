import { configDotenv } from 'dotenv'
import mysql from 'mysql2'

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'RB',
    password: 'thisDBBelongs2RB',
    database: 'perpustakaan'
})