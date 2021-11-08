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
        const { date, title, description, start_time, end_time, professionalId, clientId } = req.body;
        await connection.query(`SELECT (SELECT id FROM professional 
                WHERE id = ? 
                AND ? >= start_time 
                AND ? <= end_time) > 0 AS is_null;`, [
            professionalId,
            start_time,
            end_time
        ], (err, rows) => {
            if (err) throw err
            if (rows[0].is_null === null) {
                return res.json({ error: "Não é possivel agendar neste horário!" })
            }
            connection.query(`SELECT (SELECT scheduling.id FROM scheduling INNER JOIN professional ON professional.id = scheduling.fk_professional
                        WHERE professional.id=?
                            AND scheduling.date = ? 
                            AND ? >= scheduling.start 
                            AND ? <= scheduling.end LIMIT 1) < 0 AS time_valid`, [
                professionalId,
                date,
                start_time,
                start_time
            ], (err, rows) => {
                if (err) throw err
                if (rows[0].time_valid || rows[0].time_valid === null) {
                    connection.query('INSERT INTO scheduling (date, title, description, start, end, fk_professional, fk_client, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())', [
                        date,
                        title,
                        description,
                        start_time,
                        end_time,
                        professionalId,
                        clientId
                    ], (err, rows) => {
                        if (err) throw err
                        return res.json(rows);
                    })
                } else {
                    return res.json({ error: "Não é possivel agendar neste horário!" })
                }
            })
        })
    },

    async updateAproved(req, res) {
        const id = req.params.id;

        await connection.query('UPDATE scheduling SET aproved=true WHERE scheduling.id=?', [
            req.params.id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows);
        })
    },

    async update(req, res) {
        const id = req.params.id;
        const { title, date, start, end } = req.body;
        await connection.query('UPDATE scheduling SET title=?, description=?, date=?, start=?, end=?, updated_at=CURRENT_TIMESTAMP() WHERE scheduling.id=?', [
            title,
            description,
            date,
            start,
            end,
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