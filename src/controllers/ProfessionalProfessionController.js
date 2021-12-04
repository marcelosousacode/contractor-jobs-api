const connection = require('../db/connection');

module.exports = {
    async index(req, res) {
        await connection.query(`SELECT DISTINCT professional.*, profession.name as name_profession FROM item_professional_profession
        INNER JOIN professional ON professional.id = item_professional_profession.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profession.fk_profession ORDER BY rate DESC;`, (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    },

    async selectProfessionalsByProfession(req, res) {
        await connection.query(`SELECT DISTINCT professional.*, profession.name as name_profession, profession.id as profession_id FROM item_professional_profession
        INNER JOIN professional ON professional.id = item_professional_profession.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profession.fk_profession WHERE profession.id = ? ORDER BY rate DESC;`, [
            req.params.id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },

    async create(req, res) {
        const { professionalId, professionId, description, price, start, end } = req.body;

        await connection.query('DELETE FROM item_professional_profession where fk_professional = ? AND fk_profession != ?',
        [
            professionalId,
            professionId
        ], (err, rows) => {
            if (err) throw err
            connection.query(`
                SELECT (SELECT item_professional_profession.id 
                    FROM item_professional_profession  
                    WHERE fk_professional=? 
                    AND fk_profession=?) IS NULL as idIsNull;
            `,
                [
                    professionalId,
                    professionId
                ],
                (err, rows) => {
                    if (err) throw err
                    if(rows[0].idIsNull) {
                        connection.query('INSERT INTO item_professional_profession (fk_professional, fk_profession) VALUES (?, ?);',
                        [
                            professionalId,
                            professionId
                        ],
                        (err, rows) => {
                            if (err) throw err
                            connection.query('UPDATE professional SET description=?, price_hour=?, start_time=?, end_time=?, updated_at=CURRENT_TIMESTAMP() WHERE professional.id=?;',
                                [
                                    description,
                                    price,
                                    start,
                                    end,
                                    professionalId
                                ],
                                (err, rows) => {
                                    if (err) throw err
                                    return res.json(rows)
                                }
                            )
                        }
                        )
                    } else {
                        console.log("Não Cadastra")
                        connection.query('UPDATE professional SET description=?, price_hour=?, start_time=?, end_time=?, updated_at=CURRENT_TIMESTAMP() WHERE professional.id=?;',
                            [
                                description,
                                price,
                                start,
                                end,
                                professionalId
                            ],
                            (err, rows) => {
                                if (err) throw err
                                return res.json(rows)
                            }
                        )
                    }
                }
            )
        }) 
    },

    async delete(req, res) {
        const id = req.params.id;
        await connection.query('DELETE FROM item_professional_profession where fk_professional = ? AND fk_profession = ?',
            [
                id,
                req.body.professionId
            ], (err, rows) => {
                if (err) throw err
                return res.json(rows)
            })
    }
}