const jwt = require("jsonwebtoken")
 const authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-auth-token"];

        if (!token) {
            return res
                .status(401)
                .json({ status: false, msg: "Token must be present" });
        }

        jwt.verify(token, process.env.PASSKEY, (err, decodedToken) => {
            if (err) {
                return res
                    .status(400)
                    .json({ status: false, msg: "Invalid or expired token" });
            }

            req.user = decodedToken; // attach decoded data to request
            next();
        });
    } catch (error) {
        return res.status(500).json({ status: false, msg: "Auth error", error: error.message });
    }
};

module.exports = authentication;
