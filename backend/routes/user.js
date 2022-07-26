const express = require('express'); 
const userCtrl = require('../controllers/user');
const passwordValidate = require('../middleware/passwordValidate'); 
const rateLimit = require("../middleware/express-rate-limit");
const router = express.Router();        // on cré un routeur facon express


router.post('/signup',passwordValidate, userCtrl.signup);        
router.post('/login',rateLimit, passwordValidate, userCtrl.login);         


module.exports = router;        // on exporte nos routes vers app.js
