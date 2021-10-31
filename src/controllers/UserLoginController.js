const connection = require('../db/connection');
const crypto = require("../configs/crypto")
const jwt = require("jsonwebtoken");

require('dotenv').config();

module.exports = {
    async login(req, res) {

        const [hashType, hash] = req.headers.authorization.split(" ")
        const [email, password] = Buffer.from(hash, "base64").toString().split(":")

        await connection.query('SELECT * FROM ' + req.params.user + ' WHERE email=?', [
            email,
        ], (err, rows) => {
            
            if (err) throw err

            if(!rows[0]){
                return res.json({ error: "E-mail or password incorrect!" })
            }

            crypto.verify(password, rows[0].password).then(passwordsIsEqual =>{

                if (!passwordsIsEqual) {
                    return res.json({ error: "E-mail or password incorrect!" })
                }
    
                const token = jwt.sign({ user: {id: rows[0].id, type: req.params.user} }, process.env.authSecret, { expiresIn: 86400 })

                const {password, ...dataUser} = rows[0]
                return res.send({dataUser, token });
            }).catch(err => {
                console.log(err)
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

        await connection.query('SELECT * FROM '+ type + ' WHERE client.id=?', [
            id
        ], (err, rows) => {
            if (err) throw err
            return res.json(rows[0])
        })
    },
}