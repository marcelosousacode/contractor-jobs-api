const connection = require('../db/connection');

module.exports = {
    async index(req, res) {
        const id = req.params.id;
        await connection.query('SELECT * FROM scheduling WHERE scheduling.fk_professional=? AND scheduling.status != "CANCELADO"', [id], (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    }
}