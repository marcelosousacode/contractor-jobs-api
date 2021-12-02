const connection = require('../db/connection');
const crypto = require("../configs/crypto")
const jwt = require("jsonwebtoken");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const path = require("path");
const ejs = require("ejs");

const professionalController = require("./ProfessionalController")
const clientController = require("./ClientController")

require('dotenv').config();

module.exports = {
    async login(req, res) {

        const [hashType, hash] = req.headers.authorization.split(" ")
        const [email, password] = Buffer.from(hash, "base64").toString().split(":")

        const type = req.params.user
        await connection.query('SELECT * FROM ' + type + ' WHERE email=?', [
            email,
        ], (err, rows) => {

            if (err) throw err

            if (!rows[0]) {
                return res.json({ error: "E-mail ou senha incorreta!" })
            }

            crypto.verify(password, rows[0].password).then(passwordsIsEqual => {
                if (!passwordsIsEqual) {
                    return res.json({ error: "E-mail ou senha incorreta!" })
                }

                const token = jwt.sign({ user: { id: rows[0].id, type: req.params.user } }, process.env.authSecret, { expiresIn: 86400 })

                const { password, ...data } = rows[0]
                const dataUser = { ...data, type }

                return res.send({ dataUser, token });
            }).catch(err => {
                throw err
            })
        })
    },

    async validateToken(req, res) {
        const token = req.body.token || ""

        jwt.verify(token, process.env.authSecret, function (err, decoded) {
            return res.status(200).send({ valid: !err })
        })
    },

    async userLogged(req, res) {
        const id = req.decoded.id;
        const type = req.decoded.type

        await connection.query('SELECT * FROM ' + type + ' WHERE ' + type + '.id=?', [
            id
        ], (err, rows) => {
            if (err) throw err
            return res.send({ ...rows[0], type })
        })
    },

    async forgotPassword(req, res) {
        const { email, user } = req.body
        const token = crypto.createToken()

        await connection.query(`SELECT * FROM ${user} WHERE email=?`, [
            email
        ], (err, rows) => {
            if (err) throw err

            if (!rows[0]) {
                return res.json({ error: "O email inserido não foi encontrado!!" })
            }

            connection.query('UPDATE ' + user + ' SET reset_password_token=? WHERE email=?', [
                token,
                email
            ], (err, rows) => {
                if (err) throw err

                ejs.renderFile(path.join(__dirname, "../views_emails/forgot_password.ejs"), {
                    token: token,
                    link_app: process.env.LINK_APP,
                    user
                }).then(result => {
                    emailTemplate = result;

                    const msg = {
                        to: email, // Change to your recipient
                        from: 'everson.pereira.clear@gmail.com', // Change to your verified sender
                        subject: 'Trocar senha',
                        html: emailTemplate
                    };

                    sgMail.send(msg).then(() => {
                        (async () => {
                            return res.json(token);
                        })()
                    }).catch((error) => {
                        return res.json(error)
                    })
                })
                    .catch(error => {
                        return res.json(error)
                    });
            })
        })
    },

    async verifyTokenPassword(req, res) {
        const { token, user } = req.body

        if (user != "client" && user != "professional") {
            return res.json({ error: "O token está invalido!!" })
        }

        await connection.query(`SELECT * FROM ${user} WHERE reset_password_token=?`, [
            token
        ], (err, rows) => {
            if (err) throw err

            if (!rows[0]) {
                return res.json({ error: "O token está invalido!!" })
            }

            return res.json(rows);
        })
    },

    async changePassword(req, res) {
        const { token, password, user } = req.body
        const passwordEncrypted = await crypto.hash(password)

        await connection.query(`UPDATE ${user} SET password=?, reset_password_token="" WHERE reset_password_token=?`, [
            passwordEncrypted,
            token
        ], (err, rows) => {
            if (err) throw err

            return res.json(rows);
        })
    }
}