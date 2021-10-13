const connection = require("../db/connection")

module.exports = {
    async index(req, res){
        await connection.query("SELECT * FROM profession", (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    },

    async show(req, res){
        await connection.query("SELECT * FROM profession WHERE id = ?", [
            req.params.id
        ], (err, rows) => {
            if(err) throw err
            return res.json(rows[0])
        })
    },

    async create(req, res){
        await connection.query("INSERT INTO profession (name) VALUES (?)", [
            req.body.name
        ], (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    },

    async update(req, res){
        await connection.query("UPDATE profession SET name = ? WHERE id=?", [
            req.body.name,
            req.params.id
        ], (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    },

    async delete(req, res){
        await connection.query("DELETE FROM profession WHERE id=?", [
            req.params.id
        ], (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    }
}