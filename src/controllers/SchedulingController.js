const connection = require('../db/connection');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const path = require("path");
const ejs = require("ejs");

const { formatDate, formatToHours } = require("../utils/formatDateTime")

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

    async validateScheduling(req, res) {
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
                return res.json({ error: "O profissional não está disponível neste horário!" })
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

                if(rows[0].time_valid == false){
                    return res.json({ error: "Já existe um agendamento para este horário" })
                }

                return res.json({ error: false })
            })
        })
    },

    async create(req, res) {
        const { date, title, description, start_time, end_time, professionalId, clientId, email, servicePrice, paymentId } = req.body;

        let status = "OCUPADO"

        if (clientId) {
            status = "PENDENTE"
        }

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
                return res.status(400).json({ error: "Não é possivel agendar neste horário!" })
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
                if (err) throw err;
                if (rows[0].time_valid || rows[0].time_valid === null) {
                    connection.query(`
                        INSERT INTO scheduling (
                            date, 
                            title, 
                            description, 
                            start, 
                            end, 
                            fk_professional, 
                            fk_client, 
                            status, 
                            service_price,
                            fk_payment_id,
                            created_at, 
                            updated_at
                        ) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
                    `, [
                        date,
                        title,
                        description,
                        start_time,
                        end_time,
                        professionalId,
                        clientId,
                        status,
                        servicePrice,
                        paymentId
                    ], (err, rows) => {
                        if (err) {
                            return res.status(400).json({
                                error: err
                            })
                        }

                        if (clientId) {
                            let emailTemplate;

                            ejs.renderFile(path.join(__dirname, "../views_emails/request_email.ejs"), {
                                link_app: process.env.LINK_APP,
                                scheduling_subject: title,
                                scheduling_description: description,
                                scheduling_date: formatDate(date),
                                scheduling_time: `${formatToHours(start_time, false)} às ${formatToHours(end_time, false)}`
                            }).then(result => {
                                emailTemplate = result;

                                const msg = {
                                    to: email, // Change to your recipient
                                    from: 'everson.pereira.clear@gmail.com', // Change to your verified sender
                                    subject: 'Nova solicitação de agendamento',
                                    html: emailTemplate
                                };

                                sgMail.send(msg).then(() => {
                                    (async () => {
                                        return res.json(rows);
                                    })()
                                }).catch((error) => {
                                    console.error(err)
                                })
                            })
                                .catch(err => {
                                    console.error(err)
                                });
                        } else {
                            return res.json(rows);
                        }
                    })
                } else {
                    return res.status(400).json({ error: "Não é possivel agendar neste horário!" })
                }
            })
        })
    },

    async confirmScheduling(req, res) {
        const id = req.params.id;
        const data = req.body

        await connection.query('UPDATE scheduling SET status="APROVADO" WHERE scheduling.id=?', [
            id
        ], (err, rows) => {
            if (err) throw err

            let emailTemplate;

            ejs.renderFile(path.join(__dirname, "../views_emails/confirm_email.ejs"), {
                scheduling_subject: data.title,
                scheduling_description: data.description,
                scheduling_date: data.date,
                scheduling_time: `${data.start} às ${data.end}`,
                link_app: process.env.LINK_APP
            }).then(result => {
                emailTemplate = result;

                const msg = {
                    to: data.email, // Change to your recipient
                    from: 'everson.pereira.clear@gmail.com', // Change to your verified sender
                    subject: 'Agendamento confirmado',
                    html: emailTemplate
                };

                sgMail.send(msg).then(() => {
                    (async () => {
                        return res.json(rows);
                    })()
                }).catch((error) => {
                    console.error(err)
                })
            })
                .catch(err => {
                    console.error(err)
                });
        })
    },

    async cancelScheduling(req, res) {
        const id = req.params.id;
        const data = req.body

        await connection.query('UPDATE scheduling SET status="CANCELADO", text_reason=?, commentary=? WHERE scheduling.id=?', [
            data.text_reason,
            data.commentary,
            id
        ], (err, rows) => {
            if (err) throw err

            let emailTemplate;

            ejs.renderFile(path.join(__dirname, "../views_emails/cancel_email.ejs"), {
                scheduling_subject: data.title,
                scheduling_description: data.description,
                scheduling_date: data.date,
                scheduling_time: `${data.start} às ${data.end}`,
                scheduling_reason: data.text_reason ? data.text_reason : data.commentary,
                link_app: process.env.LINK_APP
            }).then(result => {
                emailTemplate = result;

                const msg = {
                    to: data.email, // Change to your recipient
                    from: 'everson.pereira.clear@gmail.com', // Change to your verified sender
                    subject: 'Agendamento cancelado',
                    html: emailTemplate,
                    link_app: process.env.LINK_APP
                };

                sgMail.send(msg).then(() => {
                    (async () => {
                        return res.json(rows);
                    })()
                }).catch((err) => {
                    console.error(err)
                })
            })
                .catch(err => {
                    console.error(err)
                });
        })
    },

    async notRealizedScheduling(req, res) {
        const id = req.params.id;
        const data = req.body
        console.log(data)
        await connection.query(`UPDATE scheduling SET status="NAO REALIZADO", ${data.commentary ? 'commentary' : 'text_reason'}=? WHERE scheduling.id=?`, [
            data.commentary || data.text_reason,
            id
        ], (err, rows) => {
            if (err) throw err

            let emailTemplate;

            ejs.renderFile(path.join(__dirname, "../views_emails/cancel_email.ejs"), {
                scheduling_subject: data.title,
                scheduling_description: data.description,
                scheduling_date: data.date,
                scheduling_time: `${data.start} às ${data.end}`,
                scheduling_reason: data.commentary || data.text_reason,
                link_app: process.env.LINK_APP
            }).then(result => {
                emailTemplate = result;

                const msg = {
                    to: data.email, // Change to your recipient
                    from: 'everson.pereira.clear@gmail.com', // Change to your verified sender
                    subject: 'Agendamento não foi atendido!',
                    html: emailTemplate,
                    link_app: process.env.LINK_APP
                };

                sgMail.send(msg).then(() => {
                    (async () => {
                        return res.json(rows);
                    })()
                }).catch((err) => {
                    console.error(err)
                })
            })
                .catch(err => {
                    console.error(err)
                });
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

    async updateStatus(req, res) {
        const { status } = req.body;
        const id = req.params.id;
        await connection.query('UPDATE scheduling SET status=? WHERE scheduling.id=?', [
            status,
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows);
        })
    },

    async feedback(req, res) {
        const { score, commentary, id } = req.body;
        await connection.query('UPDATE scheduling SET rating=?, commentary=? WHERE id=?', [
            score,
            commentary,
            id
        ], (err, rows) => {

            if (err) throw err
            return res.json(rows)

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