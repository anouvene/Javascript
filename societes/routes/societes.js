var express = require('express');
var router = express.Router();

var conn = require('./../connexion').connexion;

/**
 * CREATION SOCIETE
 * @param {*} soc
 */
async function createSociete(soc) {

    const societe = JSON.parse(soc.societe);
    console.log("Fonction createSociete en action: ", societe);

    await conn.execute(
        'INSERT INTO `societe`(`ID_SOCIETE`, `Nom`, `CA`, `Activite`) VALUES(?, ?, ?, ?)', [societe.ID_SOCIETE, societe.Nom, societe.CA, societe.Activite],
        function (err, results, fields) {
            if (err) {
                console.log("Erreur de creation de la societe : ", err);
            } else {
                console.log("Retour creation : ", results); // results contains rows returned by server
            }
        }
    )
}

/**
 * DELETE DES PERSONNES D UNE SOCIETE
 * @param {*} idSociete
 */
async function deletePersonnesFromSociete(idSociete, successDeletePersonnes) {
    console.log("Delete des personnes en action : ", idSociete);
    // simple query delete
    await conn.execute(
        `DELETE FROM personne WHERE ID_SOCIETE = ?`, [parseInt(idSociete)],
        function (err, results, fields) {
            if (err) {
                console.log("Error delete: ", err);
            } else {
                console.log("Resultats : ", results); // results contains rows returned by server
                successDeletePersonnes(results);
            }
        }
    );
}

/**
 * DELETE UNE SOCIETE
 * @param {*} idSociete
 */
async function deleteSociete(idSociete) {
    console.log("Delete societe en action : ", idSociete);
    // simple query delete
    await conn.execute(
        `DELETE FROM societe WHERE ID_SOCIETE = ?`, [parseInt(idSociete)],
        function (err, results, fields) {
            if (err) {
                console.log("Error delete: ", err);
            } else {
                console.log("Resultats : ", results); // results contains rows returned by server
            }
        }
    );
}

/**
 * LES SOCIETES
 * @param {*} retour
 */
function retreiveSocietes(success) {
    console.log("Fonction retreiveSocietes en action: ", success);

    conn.query(
        'SELECT * FROM `societe`',
        function (err, societes, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log("les societes recuperees: ", societes); // results contains rows returned by server
                success(societes); // CallBack
            }
        }
    );
}

/**
 * RECUPERER UNE SOCIETE
 * @param {*} retour
 */
async function retreiveOneSociete(idSociete, success) {
    await conn.execute(
        'SELECT * FROM `societe` WHERE `ID_SOCIETE` = ?', [parseInt(idSociete)],
        function (err, societe, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log("Une societe recuperee: ", societe); // results contains rows returned by server
                success(societe); // CallBack
            }
        }
    );
}

/**
 * LES PERSONNES D UNE SOCIETE
 * @param {*} req
 * @param {*} query
 * @param {*} idSociete
 * @param {*} personnes
 */
function retreivePersonnes(idSociete, success) {
    // simple query
    conn.execute(
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

// UPDATE SOCIETE
async function updateSociete(societe) {
    await conn.execute("UPDATE societe SET Nom=?, Activite=?, CA=? WHERE ID_SOCIETE=?", [
        societe.Nom,
        societe.Activite,
        societe.CA,
        societe.ID_SOCIETE
    ], (err, results, fields) => {
        if (err) {
            console.log("Error de mise a jour de la societe: ", err);
        } else {
            console.log("Resultat de mise a jour: ", results); // results contains rows returned by server
        }
    });
}

/* GET societes listing. */
router.get('/', function (req, res, next) {
    retreiveSocietes(societes => {
        res.send(JSON.stringify(societes));
        //res.render('societe', { societes: societes });       
    });   
});

/**
 * GET Societe by Id
 * GET Personnes From Societe
 */
router.get('/:idSociete', function (req, res, next) {
    retreiveOneSociete(req.params.idSociete, (societe) => { // Recuperer la societe
        retreivePersonnes(req.params.idSociete, (personnes) => { // Puis ses employes
            res.send(JSON.stringify({societe: societe, personnes: personnes}));
        });
    }).catch((error) => console.log(error));
});

/* POST societe */
router.post('/create', function (req, res, next) {
    createSociete(req.body).then(
        retreiveSocietes(societes => {
        res.send(JSON.stringify(societes));
    }));
});

/* PUT  */
router.put('/put', function (req, res, next) {
    updateSociete(JSON.parse(req.body.societe)).then(
        retreiveSocietes((societes) => {
        res.send(JSON.stringify({societes: societes}));
    }))

});

/* DELETE societe. */
router.delete('/delete', function (req, res, next) {
    // Supprimer d'abord les personnes
    deletePersonnesFromSociete(req.body.idSociete, (retourDeletePersonnes) => {
        deleteSociete(req.body.idSociete).then( // Puis la Societe
            retreiveSocietes(societes => { // Enfin recuperer la liste des societes
                res.send(JSON.stringify(societes));
            })
        );
    });
});

module.exports = router;
