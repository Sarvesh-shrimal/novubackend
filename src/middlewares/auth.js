const jwt = require('jsonwebtoken');

const authentication = async (req, res, next) =>{
    let token = req.headers['x-auth-token'];

    if(!token) {
        return res
        .status(401)
        .send({status: false, msg: "Token must be present"})
    }
    jwt.verify(token, process.env.PASSKEY, function(err, decodedToken) {
        if(err){
            return res.status(400).send({status: false, msg: "Token must be Present"});
        }
        req.user = decodedToken
        next();
    });
};

module.exports = {
    authentication,
}