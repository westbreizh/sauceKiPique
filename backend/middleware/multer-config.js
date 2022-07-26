const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({        // cste à passer à multer comme objet de configuration, qui contient la logique pour indiquer à multer ou enregistrer les fichiers entrant et pour créer le nom du fichier
  destination: (req, file, callback) => {   // fonction destination indique à multer où enregistrer les fichiers
    callback(null, 'images');
  },
  filename: (req, file, callback) => {                      // fonction de construction du nom du fichier
    const name = file.originalname.split(' ').join('_');    // remplace eventuellement les espaces par _
    const extension = MIME_TYPES[file.mimetype];            // constante dictionnaire de type MIM resoud l'estension approprié
    callback(null, name + Date.now() + '.' + extension);    
  }
});

module.exports = multer({storage: storage}).single('image');    //  nous gérons seulement les fichiers images 