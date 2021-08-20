const connection = require('../db/connection');

module.exports = {
    async login(req, res) {
        const { user, email, password } = req.body;
        await connection.query('SELECT * FROM '+ user +' WHERE email=? AND password=?', [
            email,
            password
        ], (err, rows) => {
            if (err) throw err
            
            if(rows[0] == undefined) {
                return res.json({ error: "E-mail or password incorrect!" })
            }
            return res.json(rows)
        })
    }
}