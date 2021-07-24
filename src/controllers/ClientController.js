const connection = require('../db/connection');

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
            return res.json(rows)
        })
    },

    async create(req, res) {
        const { name, email, phone_number, uf, city, password } = req.body;
        await connection.query('SELECT client.email FROM client WHERE client.email=?', [
            email
        ], (err, rows) => {
            if (err) throw err
            if(rows[0]) {
                return res.json({ error: "E-mail already registered!" })
            }

            connection.query('INSERT INTO client (name, email, phone_number, uf, city, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
                name,
                email,
                phone_number,
                uf,
                city,
                password,
                new Date().toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, ''),
                new Date().toISOString()
                    .replace(/T/, ' ')
                    .replace(/\..+/, '')
            ], (err, rows) => {
                if (err) throw err
                return res.json(rows);
            })
        })
        
    },

    async update(req, res) {
        const id = req.params.id;
        const { name, email, cpf, phone_number, uf, city, password } = req.body;
        await connection.query('UPDATE client SET name=?, email=?, cpf=?, phone_number=?, uf=?, city=?, password=?, updated_at=? WHERE client.id=?', [
            name,
            email,
            cpf,
            phone_number,
            uf,
            city,
            password,
            new Date().toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, ''),
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows);
        })
    },

    async delete(req, res) {
        const id = req.params.id;
        console.log(id)
        await connection.query('DELETE FROM client where id = ?', 
        [
            id
        ], (err, rows, fields) => {
            if (err) throw err
            return res.json(rows)
        })
    }

}