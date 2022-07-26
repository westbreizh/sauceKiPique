// installer bcrypt => npm install bcrypt ; bcrypt ne marche pas donc bcryptjs

const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MaskData = require('maskdata'); // masquage des données dans mango db
const dotenv = require("dotenv");   // charge les variables d'environnement du fichier .env dans process.env
dotenv.config();



// fonction de creation d'un compte avec email et password crypté que l'on enregistre dans mango db
exports.signup = (req, res, next) => { 
  const maskedMail = MaskData.maskEmail2(req.body.email); //  maskEmail2 méthode prédéfini du module maskdata 
  bcryptjs.hash(req.body.password, 10)    
    .then(hash => {
      const user = new User({             
        email: maskedMail,
        password: hash
      });
      user.save()          
        .then(() => { 
          console.log("utilisateur crée");
          res.status(201).json({ message: 'Utilisateur créé !' })}) 
        .catch(error => res.status(400).json({ error }) );  
    })
  .catch(error => res.status(500).json({ error })); 
};


// fonction d'autentification de connexion 
exports.login = (req, res, next) => { 
  const maskedMail = MaskData.maskEmail2(req.body.email);
    User.findOne({ email:maskedMail}) 
      .then(user => {
        if (!user) {  //email non trouvé
          console.log("mail non trouvé");
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcryptjs.compare(req.body.password, user.password) 
          .then(valid => {
            if (!valid) { //mot de passe incorrect
              console.log("mot de passe incorrect");
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({    // mail et mot de passe ok 
              userId: user._id,       
              token: jwt.sign(        
                { userId: user._id },
                `${process.env.Token_Secret_Key}`, 
                { expiresIn: '24h' }
              )
            });            
          })
          .catch(error => res.status(500).json({ error }));
      })
    .catch(error => res.status(500).json({ error })); 
  };



// memento
// le token remplacera l'identification mail password pour les requêtes futur et est renvoyé au front-end lors de la réponse. 
//dans chrome devtools onglet reseau chaque requete contient en entete authorisation avec le mot clef Baearer et plain de chiffre qui est notre token.
