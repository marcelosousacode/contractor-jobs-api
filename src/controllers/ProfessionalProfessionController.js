const connection = require('../db/connection');

module.exports = {
    async index(req, res) {
        await connection.query(`SELECT DISTINCT professional.*, profession.name as name_profession FROM item_professional_profission
        INNER JOIN professional ON professional.id = item_professional_profission.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profission.fk_profission;`, (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    },

    async selectProfessionalsByProfession(req, res) {
        await connection.query(`SELECT DISTINCT professional.*, profession.name as name_profession, profession.id as profession_id FROM item_professional_profission
        INNER JOIN professional ON professional.id = item_professional_profission.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profission.fk_profission WHERE profession.id = ?;`, [
            req.params.id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },
}