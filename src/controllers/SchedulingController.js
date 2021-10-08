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
        const { date, start_time, end_time, professionalId, clientId } = req.body;
        await connection.query(`SELECT (SELECT scheduling.id FROM scheduling INNER JOIN professional ON professional.id = scheduling.fk_professional
            WHERE professional.id=?
                AND scheduling.date = ? 
                AND ? >= professional.start_time
                AND ? <= scheduling.start_time
                AND ? <= professional.end_time  LIMIT 1) AS time_valid;`, [
            professionalId,
            date,
            start_time,
            start_time,
            end_time,
        ], (err, rows) => {
            if (err) throw err
            if(rows[0].time_valid <= 0 || rows[0].time_valid === null){
                connection.query("INSERT INTO scheduling (date, start_time, end_time, fk_professional, fk_client, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                    date,
                    start_time,
                    end_time,
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
            } else {
                return res.json({ error: "Não é possivel agendar neste horário!" });
            }
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