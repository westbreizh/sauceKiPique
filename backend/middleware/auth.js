// verfication de l'identité via le token le jeton venant du frontend, qui une fois décodé renvoit l'id de l'utilisateur que l'on compare ...

const jwt = require('jsonwebtoken'); 
const dotenv = require("dotenv");   // charge les variables d'envirronnement du fichier .env dans process.env
dotenv.config();


module.exports = (req, res, next) => {
  try {           
    const token = req.headers.authorization.split(' ')[1];          // on extrait le token contenu dans le header qui est associé au mot clef Bearer (support)  le token avait été crée lors de la requete de login et est retourné au frontend dans la reponse
    const decodedToken = jwt.verify(token, `${process.env.Token_Secret_Key}`); //renvoi un tableau avec deux obets?
    const userId = decodedToken.userId; 
    //console.log(`l'id utilisateur du corps de la requete est : ${req.body.userId}`)
    if (req.body.userId && req.body.userId !== userId) {  
      throw 'ID utilisateur est inccorrect';
    } else { 
      next();
    }
  } catch { 
    res.status(401).json({
      error: new Error('requête invalide!')
    });
  }
};