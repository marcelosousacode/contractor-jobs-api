const ejs = require('ejs');
const path = require("path");

const twilio = require('../configs/twilio');
const { generateRandomNumber } = require('../utils/generateRandomNumber');

const sgMail = require('@sendgrid/mail');
const connection = require('../db/connection');
const { formatPhoneNumber } = require('../utils/formatPhoneNumber');

module.exports = {
    async requestToken(req, res) {
        const { name } = req.body;

        const expiredAt = new Date(Date.now());
        expiredAt.setMinutes(expiredAt.getMinutes() + 10);

        const token = generateRandomNumber();

        try {
            connection.query(`
                INSERT INTO user_verification (
                    name,
                    token,
                    expired_at
                ) VALUES (?, ?, ?)
            `, [
                name,
                token,
                expiredAt
            ], (error, rows) => {
                if (error) {
                    res.status(400).send({
                        success: false,
                        error
                    })
                }

                res.status(201).send({
                    success: true,
                    id: rows.insertId
                })
            })
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async verifyToken(req, res) {
        const { token, id, type, userId } = req.body;

        try {
            connection.query(`
                SELECT * FROM user_verification 
                WHERE id = ?
            `, [
                id
            ], (error, rows) => {
                if (error) {
                    return res.status(400).send({
                        success: false,
                        error
                    })
                }

                const user = rows[0];

                const date = new Date(Date.now());
                const expiredAt = new Date(user.expired_at)

                if (typeof token === 'undefined' || token === '') {
                    return res.status(401).send({
                        success: false,
                        title: 'Token inválido',
                        message: 'Não foi enviado nenhuma chave.'
                    })
                }

                if (date <= expiredAt) {
                    if (token === user.token) {
                        const queryCommand = type === 'client'
                            ? `Update client `
                            : `Update professional `

                        connection.query(`
                            ${queryCommand} 
                            SET is_verified = true
                            WHERE id = ?;
                        `, [
                            userId
                        ], (error, rows) => {
                            if (error) {
                                return res.status(400).send({
                                    success: false,
                                    error
                                })
                            }

                            return res.status(200).send({
                                success: true,
                                title: 'Validação bem sucedida',
                                message: 'Sua conta foi validada com êxito.',
                            });
                        })
                    } else {
                        return res.status(400).send({
                            success: false,
                            title: 'Token inválido',
                            message: 'A chave informada não coincide com a chave de validação gerada.'
                        })
                    }
                } else {
                    return res.status(408).send({
                        success: false,
                        title: 'Tempo expirou',
                        message: 'O tempo de validação expirou. Por favor, requisite uma nova chave.'
                    })
                }
            })
        } catch (error) {
            res.status(400).send({
                success: false,
                error
            });
        }
    },
    async sendSMS(req, res) {
        const { id, data } = req.body;

        const phone = formatPhoneNumber(data);

        try {
            connection.query(`
                SELECT * FROM user_verification 
                WHERE id = ?
            `, [
                id
            ], (error, rows) => {
                if (error) {
                    res.status(400).send({
                        success: false,
                        error
                    })
                }

                const user = rows[0];
                const text = `Olá, ${user.name}. \n\nEste é seu código de verificação na Superpros: ${user.token}`;

                twilio.messages.create({
                    from: '+18643852839',
                    to: phone,
                    body: text
                }).then((message) => {
                    res.status(200).send({
                        success: true,
                        response: message.toJSON()
                    })
                }).catch(error => {
                    res.status(400).send({
                        success: false,
                        error
                    })
                });
            })
        } catch (error) {
            res.status(400).send({
                success: false,
                error
            })
        }
    },
    async sendEmail(req, res) {
        const { id, data } = req.body;
        const email = data;

        try {
            connection.query(`
                SELECT * FROM user_verification 
                WHERE id = ?
            `, [
                id
            ], (error, rows) => {
                if (error) {
                    res.status(400).send({
                        success: false,
                        error
                    })
                }

                const user = rows[0];

                let emailTemplate;

                ejs.renderFile(path.join(__dirname, '../views_emails/request_token.ejs'), {
                    user_name: user.name,
                    token: user.token,
                }).then(result => {
                    emailTemplate = result;

                    const msg = {
                        to: email,
                        from: 'everson.pereira.clear@gmail.com',
                        subject: 'SUPERPROS | Chave de verificação da conta',
                        html: emailTemplate
                    };

                    sgMail.send(msg).then((response) => {
                        return res.status(202).send({
                            success: true,
                            response
                        });
                    }).catch((error) => {
                        return res.status(400).send({
                            success: false,
                            error
                        });
                    })
                })
            })
        } catch (error) {
            res.status(400).send({
                success: false,
                error
            });
        }
    },
    async retryRequestToken(req, res) {
        const { id } = req.body;

        const expiredAt = new Date(Date.now());
        expiredAt.setMinutes(expiredAt.getMinutes() + 10);

        const token = generateRandomNumber();

        try {
            connection.query(`
                UPDATE user_verification
                SET token = ?, expired_at = ?
                WHERE id = ?
            `, [
                token,
                expiredAt,
                id
            ], (error, rows) => {
                if (error) {
                    res.status(400).send({
                        success: false,
                        error
                    })
                }

                res.status(201).send({
                    success: true,
                    rows
                })
            })
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async retryRequestToken(req, res) {
        const { id } = req.body;

        const expiredAt = new Date(Date.now());
        expiredAt.setMinutes(expiredAt.getMinutes() + 10);

        const token = generateRandomNumber();

        try {
            connection.query(`
                UPDATE user_verification
                SET token = ?, expired_at = ?
                WHERE id = ?
            `, [
                token,
                expiredAt,
                id
            ], (error, rows) => {
                if (error) {
                    res.status(400).send({
                        success: false,
                        error
                    })
                }

                res.status(201).send({
                    success: true,
                    rows
                })
            })
        } catch (error) {
            res.status(400).send(error);
        }
    }
}