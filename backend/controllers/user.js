// installer bcrypt => npm install bcrypt ; bcrypt ne marche pas donc bcryptjs

const bcryptjs = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MaskData = require('maskdata'); // masquage des données 
const dotenv = require("dotenv");   // charge les variables d'environnement du fichier .env dans process.env
dotenv.config();



// fonction de creation d'un compte avec email et password crypté que l'on enregistre dans mango db
exports.signup = (req, res, next) => { 
  const maskedMail = MaskData.maskEmail2(req.body.email);
  bcryptjs.hash(req.body.password, 10)    
    .then(hash => {
      const user = new User({             
        email: maskedMail,
        password: hash
      });
      console.log(user);
      user.save()          
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) 
        .catch(error => res.status(400).json({ error }) );  
    })
  .catch(error => res.status(500).json({ error })); 
};


// fonction d'autentification de connexion 
exports.login = (req, res, next) => { 
  const maskedMail = MaskData.maskEmail2(req.body.email);
  process.env.Token_Secret_Key= generateRandomString(15);
  console.log("la clef secrête d'encodage du token est:" + process.env.Token_Secret_Key);
    User.findOne({ email:maskedMail}) 
      .then(user => {
        if (!user) { 
          console.log("mail non trouvé");
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcryptjs.compare(req.body.password, user.password) 
          .then(valid => {
            if (!valid) {
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


//fonction générant un string aléatoire
function generateRandomString(num)  {
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';         // charAt() renvoie une nouvelle chaine contenant le caractère à la position indiquée en argument.
  let result= ' ';                                                                  // Math.random renvoie un nombre aléatoire entre zéro et un.
  const charactersLength = characters.length;                                       // math.foor(x), renvoie le plus grand entier inférieure ou égal à x
  for ( let i = 0; i < num; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

// memento
// le token remplacera l'identification mail password pour les requêtes futur et est renvoyé au front-end lors de la réponse. 
// le frontend end le stoke et nous le renvoit à chaque requete ensuite ?
//dans chrome devtools onglet reseau chaque requete contient en entete authorisation avec le mot clef Baearer et plain de chiffre qui est notre token.
