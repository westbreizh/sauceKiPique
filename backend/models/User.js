const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({                  
  email: { type: String, required: true, unique: true },    //creation d'un shéma de donnée mongoose via la fonction schéma,  
  password: { type: String, required: true }                // en parallèle, mangodb génère automatiquement un id
});

userSchema.plugin(uniqueValidator); // deuxième sécurité pour s'assurer que le champ est unique dans la base de donnée que l'email n'a pas déjà été utilisé 

module.exports = mongoose.model('User', userSchema); 