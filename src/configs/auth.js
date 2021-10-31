const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {  
    if(req.methods === "OPTIONS"){
        next()
    }else{
        let token = req.headers['authorization']

        if(!token) {
            return res.status(403).send({errors: ['No token provided.']})
        }

        jwt.verify(token, process.env.authSecret, (err, decoded) =>{
            if(err){
                return res.status(403).send({ errors: ["Failed to authenticate token"]})
            }else{
                req.decoded = decoded.user
                next()
            }
        })
    }
}