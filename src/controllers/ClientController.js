const connection = require('../db/connection');
const jwt = require("jsonwebtoken")
const crypto = require("../configs/crypto")

const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

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

        if (!user.password.match(regexPassword)) {
            return res.json({
                error: "Senha precisar ter: Letra maiúscula e minúscula (A, z) Caractere numérico (0-9) Caractere especial e no mínimo 8 digitos."
            })
        }

        const passwordEncrypted = await crypto.hash(user.password)

        await connection.query('SELECT client.email FROM client WHERE client.email=?', [
            user.email
        ], (err, rows) => {
            if (err) throw err
            if (rows[0]) {
                return res.json({ error: "E-mail já registrado!" })
            }

            connection.query('INSERT INTO client (name, email, phone_number, cep, uf, city, address, district, number, complement, reference, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())', [
                user.name,
                user.email,
                user.phone_number,
                user.cep,
                user.uf,
                user.city,
                user.address,
                user.district,
                user.number,
                user.complement,
                user.reference,
                passwordEncrypted
            ], (err, rows) => {
                if (err) throw err

                const { password, ...userResp } = user
                user.password = undefined

                return res.send(userResp);
            })
        })
    },

    async update(req, res) {
        const id = req.params.id;
        const { name, email, cpf, phone_number, cep, uf, address, district, number, complement, reference, city } = req.body;
        await connection.query('UPDATE client SET name=?, email=?, cpf=?, phone_number=?, cep=?, uf=?, city=?, address=?, district=?, number=?, complement=?, reference=?, updated_at=CURRENT_TIMESTAMP() WHERE client.id=?', [
            name,
            email,
            cpf,
            phone_number,
            cep,
            uf,
            city,
            address,
            district,
            number,
            complement,
            reference,
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows);
        })
    },

    async updatePassword(req, res) {
        const id = req.params.id;
        const { password, newPassword } = req.body;

        if (!newPassword.match(regexPassword)) {
            return res.json({
                error: "Senha precisar ter: Letra maiúscula e minúscula (A, z) Caractere numérico (0-9) Caractere especial e no mínimo 8 digitos."
            })
        }

        const passwordEncrypted = await crypto.hash(newPassword)

        await connection.query('SELECT * FROM client WHERE id=?', [
            id,
        ], (err, rows) => {

            crypto.verify(password, rows[0].password).then(passwordsIsEqual => {

                if (!passwordsIsEqual) {
                    return res.status(400).json({ error: "Senha atual incorreta!" })
                }

                connection.query('UPDATE client SET password=?, updated_at=CURRENT_TIMESTAMP() WHERE id=?', [
                    passwordEncrypted,
                    id
                ], (err, rows) => {
                    if (err) throw err
                    return res.status(200).json(rows);
                })

            }).catch(err => {
                throw err
            })
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
            `, [photo, id], (err, rows, fields) => {
                if (err) {
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