const passwordSchema = require("../models/password");

module.exports = (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.status(400).json({ error : "le mot de passe n'est pas assez fort : " + passwordSchema.validate(req.body.password, {list : true})});
        console.log("Le mot de passe n'est pas assez fort!")
    }
    else{
        next();
    }
}