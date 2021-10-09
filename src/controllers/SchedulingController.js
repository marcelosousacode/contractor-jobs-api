const connection = require('../db/connection');

module.exports = {

    async index(req, res) {
        await connection.query('SELECT * FROM scheduling', (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },

    async show(req, res) {
        const id = req.params.id;
        await connection.query('SELECT * FROM scheduling WHERE scheduling.id=?', [
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows[0])
        })
    },

    async create(req, res) {
        const { date, time, professionalId, clientId } = req.body;
        await connection.query('INSERT INTO scheduling (date, time, fk_professional, fk_client, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)', [
            date,
            time,
            professionalId,
            clientId,
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
        
    },

    async update(req, res) {
        const id = req.params.id;
        const { date, time } = req.body;
        await connection.query('UPDATE scheduling SET date=?, time=?, updated_at=? WHERE scheduling.id=?', [
            date,
            time,
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
        await connection.query('DELETE FROM scheduling where id = ?', 
        [
            id
        ], (err, rows, fields) => {
            if (err) throw err
            return res.json(rows)
        })
    }

}