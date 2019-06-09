var express = require('express');
var router = express.Router();
var conn = require('./../connexion').connexion;

/**
 * LISTE DES PERSONNES d UNE SOCIETE
 * @param {*} req
 * @param {*} query
 * @param {*} idSociete
 * @param {*} personnes
 */
function retreivePersonnes(idSociete, success) {
    // simple query
    conn.query(
        'SELECT * FROM `personne` WHERE `ID_SOCIETE` = ?', [idSociete],
        function (err, personnes, fields) {
            if (err) {
                console.log("Error ", err);
            } else {
                console.log("Les personnes: ", personnes); // results contains rows returned by server

                success(personnes);
            }
        }
    );
}

/**
 * CREATION PERSONNE
 * @param {*} pers
 */
async function createPersonne(personne) {
    console.log("Fonction createPersonne en action: ", personne);

    try {
        // const result = await pool.execute(sql, parameters);
       await conn.execute(
            'INSERT INTO `personne`(`ID_Personne`, `Nom`, `Prenom`, `Poids`, `Taille`, `Sexe`, `ID_SOCIETE`) VALUES(?, ?, ?, ?, ?, ?, ?)', [
                personne.ID_Personne,
                personne.Nom,
                personne.Prenom,
                personne.Poids,
                personne.Taille,
                personne.Sexe,
                parseInt(personne.ID_SOCIETE)
            ],
            function (err, results, fields) {
                if (err) {
                    console.log("Erreur de creation de la societe : ", err);
                } else {
                    console.log("Retour creation : ", results); // results contains rows returned by server
                }
            }
        );

    }
    catch (error) {
        handle(error);
    }

}

/* GET Personnes d'une societe. */
router.get('/societe/:idSociete', function (req, res, next) {
    retreivePersonnes(req.params.idSociete, personnes => {
        res.send(JSON.stringify(personnes));
    });
});

/* POST Personne */
router.post('/create', function (req, res, next) {
    const personne = JSON.parse(req.body.personne);
    console.log('Récuperation de la personne: ', personne);
    console.log('Récuperation ID_SOCIETE: ', personne.ID_SOCIETE);

    createPersonne(personne).then(retreivePersonnes(personne.ID_SOCIETE, personnes => {
        console.log("Retour des societes via la callBack de la fonction : ", personnes); // success(personnes)

        res.send(personnes);
    }));
});

/**
 * DELETE une personne
 */
router.delete('/:idPersonne', function (req, res, next) {
    conn.execute(
        "DELETE FROM personne WHERE ID_Personne=?", [req.params.idPersonne], function(err, results, fields) {
        if (err) {
            console.log("Erreur de suppression de la personne : ", err);
        } else {
            console.log("Suppression avec success : ", results); // results contains rows returned by server
            res.send(results);
        }
    });
});

router.put('/put', function (req, res, next) {
    const personne = JSON.parse(req.body.personne);
    // console.log("PUT personne en action: ", personne.ID_Personne);

    conn.execute(
        "UPDATE personne SET Nom=?, Prenom=?, Poids=?, Taille=?, Sexe=?, ID_SOCIETE=? WHERE ID_Personne=?", [
        personne.Nom,
        personne.Prenom,
        personne.Poids,
        personne.Taille,
        personne.Sexe,
        personne.ID_SOCIETE,
        personne.ID_Personne
    ], function(err, results, fields) {
        if (err) {
            console.log("Erreur de mise à jour de la personne : ", err);
        } else {
            console.log("Mise à jour avec success : ", results); // results contains rows returned by server
            res.send(results);
        }
    });
});


module.exports = router;
