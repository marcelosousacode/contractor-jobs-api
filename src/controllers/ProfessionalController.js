const connection = require('../db/connection');

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

    async create(req, res) {
        const { name, email, phone_number, uf, city, password } = req.body;
        await connection.query('SELECT professional.email FROM professional WHERE email=?', [
            email
        ], (err, rows) => {
            if (err) throw err
            if (rows[0]) {
                return res.json({ error: "E-mail já registrado!" })
            }

            connection.query('INSERT INTO professional (name, email, phone_number, uf, city, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())', [
                name,
                email,
                phone_number,
                uf,
                city,
                password
            ], (err, rows) => {
                if (err) throw err
                return res.json(rows);
            })
        })
    },
    async update(req, res) {
        const id = req.params.id;
        const { name, email, cpf, phone_number, photo, uf, city, password, rate, description, start_time, end_time } = req.body;

        await connection.query('UPDATE professional SET name=?, email=?, cpf=?, phone_number=?, photo=?, uf=?, city=?, password=?, rate=?, description=?, start_time=?, end_time=?, updated_at=CURRENT_TIMESTAMP() WHERE professional.id=?', [
            name,
            email,
            cpf,
            phone_number,
            photo,
            uf,
            city,
            password,
            rate,
            description,
            start_time,
            end_time,
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows);
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