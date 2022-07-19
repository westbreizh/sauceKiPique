const express = require('express'); 
const sauceCtrl = require('../controllers/sauce'); 
const auth = require('../middleware/auth'); 
const multer = require('../middleware/multer-config'); 

const router = express.Router();        // création d'un routeur d'express 


router.get('/',auth, sauceCtrl.getArrayOfAllSauce);     // pour une requete de type get, post, put ou delete 
router.get('/:id',auth, sauceCtrl.getOneSauce);         //  avec un point d'entrée qui vise /api/sauces/ ect...
router.post('/',auth, multer, sauceCtrl.createSauce);   // on applèle le code contenu dans le(s) middleware(s) et celui de fin contenu dans controllers
router.put('/:id',auth, multer, sauceCtrl.modifySauce);  
router.delete('/:id',auth, sauceCtrl.deleteSauce);  
router.post('/:id/like',auth, sauceCtrl.likeOrNot); 



module.exports = router; // on exporte ce routeur pour s'en servir dans l'application 