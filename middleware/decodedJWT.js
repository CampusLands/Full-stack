const jwt = require('jsonwebtoken');
// const fs = require("fs");

exports.auth = (req, res, next)=>{
    try {
        // const SECRET_KEY = fs.readFileSync('./certificate.csr');
        // const payload = jwt.verify(req.session.auth, SECRET_KEY.toString('utf8'));
        const payload = jwt.verify(req.session.auth, process.env.EXPRESS_SECRET_KEY);
        req.data = payload;
        next();
    } catch (error) {
        return res.status(401).json({status: 401, message: "Unauthorized"});
    }
}