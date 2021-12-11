const connection = require('../db/connection');
const crypto = require("../configs/crypto")

module.exports = {
    async index(req, res) {
        await connection.query('SELECT * FROM professional', (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },
    
    async show(req, res) {
        await connection.query('SELECT * FROM professional WHERE professional.id=?', [
            req.params.id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows[0])
        })
    },

    async professionsList(req, res) {
        const id = req.params.id;
        await connection.query(`SELECT  profession.*, item_professional_profession.fk_professional, item_professional_profession.fk_profession  FROM item_professional_profession
            INNER JOIN profession ON profession.id = item_professional_profession.fk_profession
            WHERE fk_professional=?`, 
            [id], 
            (err, rows) => {
                if (err) throw err
                return res.json(rows)
            }
        )
    },

    async create(req, res) {
        const { name, email, phone_number, cpf, cep, uf, city, address, district, number, complement, reference, password } = req.body;

        const passwordEncrypted = await crypto.hash(password)

        await connection.query('SELECT professional.email FROM professional WHERE email=?', [
            email
        ], (err, rows) => {
            if (err) throw err
            if (rows[0]) {
                return res.json({ error: "E-mail já registrado!" })
            }

            connection.query('INSERT INTO professional (name, email, phone_number, cpf, cep, uf, city, address, district, number, complement, reference, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())', [
                name,
                email,
                phone_number,
                cpf,
                cep,
                uf,
                city,
                address,
                district,
                number,
                complement,
                reference,
                passwordEncrypted
            ], (err, rows) => {
                if (err) throw err
                return res.json(rows);
            })
        })
    },

    async update(req, res) {
        const id = req.params.id;
        const { name, email, cpf, phone_number, cep, uf, city, address, district, number, complement, reference, } = req.body;

        await connection.query('UPDATE professional SET name=?, email=?, cpf=?, phone_number=?, cep=?, uf=?, city=?, address=?, district=?, number=?, complement=?, reference=?, updated_at=CURRENT_TIMESTAMP() WHERE professional.id=?', [
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

        const passwordEncrypted = await crypto.hash(newPassword)

        await connection.query('SELECT * FROM professional WHERE id=?', [
            id,
        ], (err, rows) => {

            crypto.verify(password, rows[0].password).then(passwordsIsEqual =>{
                
                if (!passwordsIsEqual) {
                    return res.json({ error: "Senha atual incorreta!" })
                }

                connection.query('UPDATE professional SET password=?, updated_at=CURRENT_TIMESTAMP() WHERE id=?', [
                    passwordEncrypted,
                    id
                ], (err, rows) => {
                    if (err) throw err
                    return res.json("Senha alterada com sucesso!");
                })
                
            }).catch(err => {
                throw err
            })
        })
    },

    async delete(req, res) {
        const id = req.params.id;
        await connection.query('DELETE FROM professional where id = ?',
            [
                id
            ], (err, rows) => {
                if (err) throw err
                return res.json(rows)
            })
    }
}