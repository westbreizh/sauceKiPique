const express = require('express'); 
const userCtrl = require('../controllers/user');
const passwordValidate = require('../middleware/passwordValidate'); 
const rateLimit = require('express-rate-limit'); // package pour prévenir des attaques par force brute

const router = express.Router();        // on cré un routeur facon express

const passLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,            // 1 minute : temps défini pour valider le login 
    max: 3                              // 3 essais max par adresse ip
  });

router.post('/signup',passwordValidate, userCtrl.signup);        
router.post('/login',passLimiter, passwordValidate, userCtrl.login);         


module.exports = router;        // on exporte nos routes vers l'application