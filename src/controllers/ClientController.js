const connection = require('../db/connection');
const jwt = require("jsonwebtoken")
const crypto = require("../configs/crypto")

module.exports = {
    async index(req, res) {
        await connection.query('SELECT * FROM client', (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },

    async show(req, res) {
        const id = req.params.id;
        await connection.query('SELECT * FROM client WHERE client.id=?', [
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows[0])
        })
    },

    async create(req, res) {
        const user = req.body;

        const passwordEncrypted = await crypto.hash(user.password)

        await connection.query('SELECT client.email FROM client WHERE client.email=?', [
            user.email
        ], (err, rows) => {
            if (err) throw err
            if (rows[0]) {
                return res.json({ error: "E-mail já registrado!" })
            }

            connection.query('INSERT INTO client (name, email, phone_number, uf, city, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
                user.name,
                user.email,
                user.phone_number,
                user.uf,
                user.city,
                passwordEncrypted,
                new Date().toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, ''),
                new Date().toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, '')
            ], (err, rows) => {
                if (err) throw err

                const { password, ...userResp } = user
                user.password = undefined

                return res.send(rows);
            })
        })

    },

    async update(req, res) {
        const id = req.params.id;
        const { name, email, cpf, phone_number, uf, city, password } = req.body;
        await connection.query('UPDATE client SET name=?, email=?, cpf=?, phone_number=?, uf=?, city=?, password=?, updated_at=CURRENT_TIMESTAMP() WHERE client.id=?', [
            name,
            email,
            cpf,
            phone_number,
            uf,
            city,
            password,
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows);
        })
    },

    async delete(req, res) {
        const id = req.params.id;
        await connection.query('DELETE FROM client where id = ?',
            [
                id
            ], (err, rows, fields) => {
                if (err) throw err
                return res.json(rows)
            })
    },

    async updateImage(req, res) {
        const id = req.params.id;
        const { photo } = req.body;

        try {
            await connection.query(`
                UPDATE client 
                SET photo=?
                WHERE id=?
            `, [ photo, id ], (err, rows, fields) => {
                if(err) {
                    console.log(err)
                    res.status(400).send({
                        error: err.name,
                        message: err.sqlMessage
                    })
                };
                
                return res.status(200).send(rows);
            })
        } catch (error) {
            res.status(400).send({
                error: err.name,
                message: err.sqlMessage
            });
        }
    }
}