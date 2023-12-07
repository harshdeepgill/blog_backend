const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const auth = async (req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(token, process.env.KEY, function(err, decoded) {
            if(decoded){
                next();
            }else{
                res.status(500).send({"msg": "Token expired!"})
            }
        });
    } catch (err) {
        res.status(500).send({"msg": "Error in middleware!", "error": err});
    }
}

module.exports = {auth}