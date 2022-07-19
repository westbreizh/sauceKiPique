const express = require('express'); 
const userCtrl = require('../controllers/user');
const passwordValidate = require('../middleware/passwordValidate'); 

const router = express.Router();        // on cré un routeur facon express


router.post('/signup',passwordValidate, userCtrl.signup);        // pour une requete de type post,  avec un point d'entrée  /api/auth/signup ou login
router.post('/login',passwordValidate, userCtrl.login);          // on appèle le code de la fonction à appliquer


module.exports = router;        // on exporte nos routes vers l'application