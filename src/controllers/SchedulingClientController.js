const connection = require("../db/connection")


module.exports = {

    async index(req, res) {
        const id = req.params.id;
        await connection.query(`SELECT scheduling.*, professional.name, professional.email, professional.phone_number, professional.uf, professional.city, professional.email FROM scheduling
        INNER JOIN client ON client.id = scheduling.fk_client
        INNER JOIN professional ON professional.id = scheduling.fk_professional
        WHERE scheduling.fk_client=?  ORDER BY scheduling.end ASC`, [
                id
            ],
        (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },

    async show(req, res){
        const idProfessionalLogged = req.params.id

        await connection.query(`SELECT DISTINCT client.name, client.email, client.phone_number, client.uf, client.city, client.address, client.district, client.number, scheduling.* FROM scheduling
        INNER JOIN professional ON professional.id = scheduling.fk_professional
        INNER JOIN client ON client.id = scheduling.fk_client WHERE professional.id = ?
        ORDER BY scheduling.end ASC;`, [
            idProfessionalLogged
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    }
}