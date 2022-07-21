
const fs = require('fs');       // fs pour file system, donne accès aux fonctions qui modifie le système de fichier
const mongoose = require('mongoose'); 
const Sauce = require('../models/Sauce'); 



//méthode de création d'une sauce et de son enregistrement dans la bdd

exports.createSauce = (req, res, next) => { 
  const sauceObject = JSON.parse(req.body.sauce);     // le fait d'avoir un fichier image change le format de la requete. SON.parse() transforme un obet stringifié en objet javascript exploitable
  delete sauceObject._userId;     // par sécurité on suprime l'id envoyé en s'appuie oar celui récupéré via le token 
  const sauce = new Sauce({ 
    ...sauceObject,     // opérateur spread raccourci
    likes: 0, 
    dislikes: 0, 
    usersLiked: [], 
    usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`    // req.protocol renvoie le http ou https,  req.get ('host') => donne le host de notre serveur (ici localhost 3000 en réel racine de notre serveur) ensuite dossier images et le nom du fichier
  });
  sauce.save().then( 
    () => {
      console.log("la sauce est bien enregistré " + sauce);
      res.status(201).json({ 
      message: 'Post saved successfully!'
      })
      ;
    }
  ).catch( 
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



// méthode qui renvoi le tableau de l'ensemble des sauces contenu dans mangodb

exports.getArrayOfAllSauce = (req, res, next) => { 
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


// métode qui renvoit la  sauce contenu dans mangodb via le id de la sauce 

 exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id    
  }).then( 
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch( 
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};



// middleware qui supprime la sauce selectionné

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })  
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];     // on extrait le nom du fichier à supprimer, objet à droite de images dans le  tableau crée par spli()
      fs.unlink(`images/${filename}`, () => {                   // on supprime le fichier via fs.unlink
        Sauce.deleteOne({ _id: req.params.id }) 
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};




// middleware qui modifie une sauce

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?    // opérateur terner pour savoir si on a un fichier, une image en l'occurence, alors...
  {
    ...JSON.parse(req.body.sauce), 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
     } : { ...req.body };        //sinon

  //delete sauceObject.userId;
  Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           //if (sauce.userId != req.auth.userId) {  //?? a revoir
            if (sauce.userId != sauceObject.userId) {  
               res.status(401).json({ message : 'Not authorized'});
           } else {

              Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
              .then(() => res.status(200).json({ message: 'Objet modifié !'}))
              .catch(error => res.status(400).json({ error }));
              };
              if ( sauceObject.imageUrl != undefined){
                const filename = sauce.imageUrl.split('/images/')[1];     
                fs.unlink(`images/${filename}`, () => {               
                  console.log('image modifié et ancienne supprimé');
              })};
        });
  }      
  


// middleware qui gère les appréciations des utilisatures par rapport aux sauces

exports.likeOrNot = (req, res, next) => {
  let userId = req.body.userId;
  let likeorNot = req.body.like;
  console.log(req.body);
  Sauce.findOne({_id: req.params.id }) 
    .then( (sauce) => {
      if ( likeorNot == 1 && !(sauce.usersLiked.includes(userId))){             //  utilisateur like pour la première fois
          Sauce.updateOne({ _id: req.params.id }, {$push:{usersLiked: userId}, $inc:{likes: 1} }) 
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
      }else if (likeorNot == -1 && !(sauce.usersDisliked.includes(userId))){    //  utilisateur dislike pour la première fois
          Sauce.updateOne({ _id: req.params.id }, {$push:{usersDisliked: userId}, $inc:{dislikes: 1} }) 
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
      }else if (likeorNot == 0 && sauce.usersLiked.includes(userId)){           // utilisateur enlève son like
          Sauce.updateOne({ _id: req.params.id }, {$pull:{usersLiked: userId}, $inc:{likes: -1} }) 
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
        }else if (likeorNot == 0 && sauce.usersDisliked.includes(userId)){      // utilisateur enlève son dislike
        Sauce.updateOne({ _id: req.params.id }, {$pull:{usersDisliked: userId}, $inc:{dislikes: -1} }) 
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
        }else {
          console.log("Ya une yeucou ds le tajepo !!");
      }
    })
    .catch( 
      (error) => {
        console.log("erreur de fin")
        res.status(404).json({
          error: error
        });
      }
    );
  };