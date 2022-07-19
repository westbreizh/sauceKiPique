const mongoose = require('mongoose');  

const sauceSchema = mongoose.Schema({               //creation d'un shéma de donnée mongoose via la fonction schéma, 
    userId: { type: String, required: true },       // en parallèle, mangodb génère automatiquement un id 
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type:[ "String <userId>" ] , required: true },
    usersDisliked: { type:[ "String <userId>" ] , required: true },
})




module.exports = mongoose.model('Sauce', sauceSchema);      // métode model transforme ce modèle en un modèle réutilisable, premier argument le nom du model , deuxième argument le nom du shéma


















