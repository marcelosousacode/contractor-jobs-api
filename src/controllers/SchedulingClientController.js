const connection = require("../db/connection")


module.exports = {

    async index(req, res) {
        const id = req.params.id;
        await connection.query(`SELECT scheduling.*, client.name, client.email, client.phone_number, client.uf, client.city, client.email FROM scheduling
            INNER JOIN client ON client.id = scheduling.fk_client
            WHERE scheduling.fk_client=?`, [
                id
            ],
        (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },

    async show(req, res){
        const idProfessionalLogged = req.params.id

        await connection.query(`SELECT DISTINCT client.name, client.email, client.phone_number, client.uf, client.city, scheduling.id, scheduling.title, scheduling.description, scheduling.start, scheduling.end FROM scheduling
        INNER JOIN professional ON professional.id = scheduling.fk_professional
        INNER JOIN client ON client.id = scheduling.fk_client WHERE professional.id = ? AND scheduling.status="PENDENTE"
        ORDER BY scheduling.date DESC;`, [
            idProfessionalLogged
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    }

}