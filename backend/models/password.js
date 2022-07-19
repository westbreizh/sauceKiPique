const passwordValidator = require("password-validator")

const schema = new passwordValidator();
 
schema
.is().min(8)                                    // Taille minimum 8
.is().max(100)                                  // Taille maximum 100
.has().uppercase()                              // Doit contenir des lettres majuscules
.has().lowercase()                              // Doit contenir des lettres minuscules
.has().digits(1)                                // Doit au moins avoir 2 chiffres
.has().not().spaces()                           // Ne doit pas contenir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklister ces valeurs
 
module.exports = schema;