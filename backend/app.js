//  tour de contrôle de notre API, on y cré notre api via le framework express

const express = require('express'); 
const mongoose = require('mongoose'); 
const path = require('path'); 
const dotenv = require("dotenv");   // charge les variables d'envirronnement du fichier .env dans process.env
dotenv.config();
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const userRoutes = require('./routes/user');  
const sauceRoutes = require('./routes/sauces');  


// on crée une application express
const app = express(); 


// connection à notre base de donnée mangoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}${process.env.DB_NAME}`, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie, on est au top !'))
  .catch(() => console.log('Connexion à MongoDB échouée, pas top !'));

  
// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => { 
  //res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //res.setHeader('Cross-Origin-Ressource-Policy','cross-origin');
  //res.setHeader('Cross-Origin-Ressource-Policy','same-site');
  //res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});



// gestion de l'interception des requêttes du client et appèle des routeurs 
app.use(express.json()); 
app.use(mongoSanitize());  //Le package mangoSanitiyse desinfecte les requetes malvaillantes vers mangodb dont celle commencant par un $ ...
//app.use(helmet());    // utilisation du module 'helmet' pour la sécurité en protégeant l'application des failles XSS 
app.use('/api/auth', userRoutes )       // intercepte requête avec le début du nom de la route et ensuite dirige vers le routeur
app.use('/api/sauces', sauceRoutes ) 
app.use('/images', express.static(path.join(__dirname, 'images')));     // Middleware permettant de charger les fichiers qui sont dans le repertoire images, on ne connaitra pas l'emplacement de notre ressource image donc on passe par le module path .... _dirname coorespond à l'endroit ou l'on se trouve et on oint jusqu'au dossier image pour avoir le chemin ...


 
module.exports = app; 