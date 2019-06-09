var express = require('express');
var router = express.Router();

// Import module de connexion
var conn = require('./../connexion').connexion;

/**
 * LES SOCIETES
 * Executer une requete et faire appel au callbak success pour retourner la listes des societes
 * @param {*} success Callback retournant les enregistrement de sociétés
 */
function retreiveSocietes(success) {
  conn.query(
      'SELECT * FROM `societe`',
      function (err, societes, fields) {
          if (err) {
              console.log(err);
          } else {
              success(societes); // CallBack
          }
      }
  );
}

/* GET page accueil sociétés. */
router.get('/', function(req, res, next) {
  retreiveSocietes(
      societes => {
      // Rendre la vue "societe.js" via SWIG
      res.render('societe', { title: 'Liste des sociétes', societes: societes });
    }
  );
});

module.exports = router;
