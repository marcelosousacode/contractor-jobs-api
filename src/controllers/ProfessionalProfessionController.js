const connection = require('../db/connection');

module.exports = {
    async index(req, res) {
        await connection.query(`SELECT 
            professional.id,
            professional.name,
            professional.email,
            professional.cpf,
            professional.phone_number,
            professional.photo,
            professional.cep,
            professional.uf,
            professional.city,
            professional.rate,
            professional.description,
            professional.week,
            professional.unavailable_day,
            professional.start_time,
            professional.end_time,
            professional.price_hour,
            GROUP_CONCAT(profession.name SEPARATOR ', ') as name_profession
        FROM item_professional_profession
        INNER JOIN professional ON professional.id = item_professional_profession.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profession.fk_profession GROUP BY professional.id ORDER BY rate DESC;`, (err, rows) => {
            if(err) throw err
            return res.json(rows)
        })
    },

    async show(req, res) {
        await connection.query(`SELECT 
            professional.id,
            professional.name,
            professional.email,
            professional.cpf,
            professional.phone_number,
            professional.photo,
            professional.cep,
            professional.uf,
            professional.city,
            professional.rate,
            professional.description,
            professional.week,
            professional.unavailable_day,
            professional.start_time,
            professional.end_time,
            professional.price_hour,
            GROUP_CONCAT(profession.name SEPARATOR ', ') as name_profession
        FROM item_professional_profession
        INNER JOIN professional ON professional.id = item_professional_profession.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profession.fk_profession
        WHERE professional.id = ?
        GROUP BY professional.id ORDER BY rate DESC;`, [req.params.id], (err, rows) => {
            if(err) throw err
            return res.json(rows[0])
        })
    },

    async selectProfessionalsByProfession(req, res) {
        await connection.query(`SELECT 
            professional.id,
            professional.name,
            professional.email,
            professional.cpf,
            professional.phone_number,
            professional.photo,
            professional.cep,
            professional.uf,
            professional.city,
            professional.rate,
            professional.description,
            professional.week,
            professional.unavailable_day,
            professional.start_time,
            professional.end_time,
            professional.price_hour,
            profession.name as name_profession,
            profession.id as profession_id
        FROM item_professional_profession
        INNER JOIN professional ON professional.id = item_professional_profession.fk_professional
        INNER JOIN profession ON profession.id = item_professional_profession.fk_profession WHERE profession.id = ? ORDER BY rate DESC;`, [
            req.params.id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows)
        })
    },

    async updateProfessionalInfo(req, res) {
        const { professionalId, professionId, description, price, week, start, end } = req.body;

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
                            connection.query('UPDATE professional SET description=?, price_hour=?, week=?, start_time=?, end_time=?, updated_at=CURRENT_TIMESTAMP() WHERE professional.id=?;',
                                [
                                    description,
                                    price,
                                    week,
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
                        connection.query('UPDATE professional SET description=?, price_hour=?, week=?, start_time=?, end_time=?, updated_at=CURRENT_TIMESTAMP() WHERE professional.id=?;',
                            [
                                description,
                                price,
                                week,
                                start,
                                end,
                                professionalId
                            ],
                            (err, rows) => {
                                if (err) throw err
                                console.log(week)
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