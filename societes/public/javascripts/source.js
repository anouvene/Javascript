function genererSocietes(societes) {
    console.log("Generer liste apres delete en action ...");
    let tr = "";
    for (let societe of societes) {
        tr += "<tr>"
            + "<td>" + societe.ID_SOCIETE + "</td>"
            + "<td>" + societe.Nom + "</td>"
            + "<td>" + societe.CA + "</td>"
            + "<td>" + societe.Activite + "</td>"
            + "<td class='actions'>"
            + "<a href='#collapsePersonnes' title='Voir les personnes' class='btn btn-primary btn-voir'"
            + "data-idsociete='" + societe.ID_SOCIETE + "' data-toggle='collapse' data-target='#collapsePersonnes'><i class='material-icons md-24'>visibility</i></a>"
            + " <a href='#societe' title='Modifier une societe' class='btn btn-warning btn-edit'"
            + "data-idsociete='" + societe.ID_SOCIETE + "' data-toggle='modal' data-target='#editSocieteModal'><i class='material-icons md-24'>edit</i></a>"
            + " <a href='#societe' title='Supprimer une societe' class='btn btn-danger btn-delete' data-idsociete='" + societe.ID_SOCIETE + "'><i class='material-icons md-24'>delete_forever</i></a>"
            + "</td>"
            + "</tr>";
    }

    $("#societesTbody").html(tr);
}

function genererUneSociete(societe, personnes) {
    let ligneSociete = "<div class='row'><div class='col'><input type='text' name='idSociete' class='form-control' value='" + societe[0].ID_SOCIETE + "' readonly></div>"
        + "<div class='col'><input type='text' name='nomSocieteTxt' value='" + societe[0].Nom + "' class='form-control'></div>"
        + "<div class='col'><input type='text' name='caSocieteTxt' value='" + societe[0].CA + "' class='form-control'></div>"
        + "<div class='col'><input type='text' name='activiteSocieteTxt' value='" + societe[0].Activite + "' class='form-control'></div></div><hr>";

    let $table = $("<table class='table table-condensed' style='border-collapse: collapse;'>"
    + "<thead><tr><th scope='col'>Id personne</th><th scope='col'>Nom</th><th scope='col'>Prenom</th><th scope='col'>Poids</th><th scope='col'>Taille</th><th scope='col' colspan='3'>Sexe</th></tr></thead>"
    + "<tbody id='personnesModalTbody'></tbody></table>");

    $("#societeModal").html(ligneSociete);

    // Puis insérer la table de personnes
    $("#societeModal").next().remove();
    $table.insertAfter("#societeModal");

    // Enfin insérer les personnes
    if(personnes.length > 0) {
        for(let personne of personnes) {
            $("#personnesModalTbody").append(genererUneLigneDePersonne(personne.ID_Personne, personne));
        }
    }
}

function genererPersonnes(personnes) {
    let tr = "";
    for (let personne of personnes) {
        tr += "<tr>"
            + "<td>" + personne.ID_Personne + "</td>"
            + "<td>" + personne.ID_SOCIETE + "</td>"
            + "<td>" + personne.Nom + "</td>"
            + "<td>" + personne.Prenom + "</td>"
            + "<td>" + personne.Poids + "</td>"
            + "<td>" + personne.Taille + "</td>"
            + "<td>" + personne.Sexe + "</td>"
            + "</tr>";
    }

    $("#personnesTbody").html(tr);
}

function genererUneLigneDePersonne(idSociete, personne) {

    // Générer une ligne de personne
    return $("<tr>"
    + "<td><input type='text' name='idPersonne' value='" + personne.ID_Personne + "' class='form-control' readonly></td>"
    + "<td><input type='text' name='nom' value='" + personne.Nom + "' class='form-control' readonly></td>"
    + "<td><input type='text' name='prenom' value='" + personne.Prenom + "' class='form-control' readonly></td>"
    + "<td><input type=''text' name='poids' value='" + personne.Poids + "' class='form-control' readonly></td>"
    + "<td><input type='text' name='taille' value='" + personne.Taille + "' class='form-control' readonly></td>"
    + "<td><input type='text' name='sexe' value='" + personne.Sexe + "' class='form-control' readonly></td>"
    + "<td><a href='#' title='Modifier une personne' class='btn btn-success btn-modal-edit' data-idpersonne='" + personne.ID_Personne + "'><i class='material-icons md-24'>edit</i></a></td>"
    + "<td><a href='#' title='Supprimer cette personne' class='btn btn-secondary btn-modal-delete'><i class='material-icons md-24'>delete_forever</i></a></td>"
    + "</tr>");
}

$(function () {
    // LISTE DES SOCIETES
    // $.ajax({
    //     url: "/societes",
    //     type: "GET",
    //     dataType: "JSON",
    //     success: function (societes, status) {
    //         genererSocietes(societes);
    //     },
    //     error: function (error) {
    //         console.log(error);
    //     }
    // });

    // AJOUTER UNE SOCIETE
    $("#btnAddSociete").on("click", function () {
        const idTxt = $("#txtID").val().trim();
        const nomTxt = $("#txtNom").val().trim();
        const activiteTxt = $("#txtActivite").val().trim();
        const caTxt = $("#txtCA").val().trim();

        const societe = {
            ID_SOCIETE: idTxt,
            Nom: nomTxt,
            Activite: activiteTxt,
            CA: caTxt
        }

        $.ajax({
            url: '/societes/create',
            type: 'POST',
            ContentType: 'application/json',
            // data: "idSociete=" + idTxt + "&nomSociete=" + nomTxt + "&activite=" + activiteTxt + "&caSociete=" + caTxt,
            data: { societe: JSON.stringify(societe) },
            dataType: 'JSON',
            success: function (societes, status) {
                // alert("Retour creation", status);
                // Reactualiser les societes
                console.log("Societes recup apres creation: ", societes);
                // genererSocietes(societes);

                // Fermer et vider formulaire d ajout
                $("#collapseSocieteFormAjout").find("form#eleve_form_ajout input[type=text]").val("").end().collapse("hide");

                // Reactualiser affichage a la ferture du formulaire ajout
                //$("body").on('hidden.bs.collapse', '#collapseSocieteFormAjout', function () {
                    genererSocietes(societes);
                //});
            }
        });
    });

    // LES PERSONNES DE LA SOCIETE
    $("#societe_form").on("click", ".btn-voir", function () {
        $(".btn-voir").removeClass("btn-success");
        $(".btn-voir").find("i").empty().text("visibility");

        // Changer l'apparence du bouton
        if ($(this).find("i").text() == "visibility") {

            $(this).addClass("btn-success");
            $(this).find("i").empty().text("visibility_off");
        } else {
            $(this).removeClass("btn-success");
            $(this).find("i").empty().text("visibility");

            $("#collapsePersonnes").collapse('hide');
        }

        // Generer les tr personnes via AJAX
        $.ajax({
            url: "/personnes/societe/" + $(this).attr("data-idsociete"),
            type: "GET",
            dataType: "JSON",
            // data: "idSociete=" + $(this).attr("data-idsociete"),
            success: function (personnes, status) {
                genererPersonnes(personnes);
            }
        });


        // Reouvrir immediatement le bloc collapseNotes when il est fermé
        $('#collapsePersonnes').on('hidden.bs.collapse', function () {
            $(this).collapse("show");
        });


    });

    // DELETE SOCIETE
    $("#societe_form").on("click", ".btn-delete", function (e) {
        e.preventDefault();
        $this = $(this);


        $.ajax({
            url: "/societes/delete",
            type: "DELETE",
            dataType: "JSON",
            data: {idSociete: $(this).attr("data-idsociete")},
            success: function (societes, status) {
                console.log("Societes recup apres le delete: ", societes);
                // genererSocietes(societes);
                $this.trigger("click");

                // Reactualiser l'affichage apres un trigger click du bouton "btn-delete"
                genererSocietes(societes);

            }
        });
    });

    // MODAL: Societe et ses employes
    $("#societe_form").on("click", ".btn-edit", function () { // Delegate event click
        $this = $(this); // .btn-edit

        // Fermer collapse personnes
        $("#collapsePersonnes").collapse("hide");

        $('#editSocieteModal').on('shown.bs.modal', function (e) {
            $(this).css({ "padding-right": "0px", "display": " block" }); // enlever padding-right du modal

            $(this).find("#societesModalTbody").empty();

            $.ajax({
                url: "/societes/" + $this.attr("data-idsociete"),
                type: "GET",
                // data: "idSociete=" + $this.attr("data-idsociete"),
                dataType: "JSON",
                success: function (societe_personnes, status) {
                    console.log("Societe a modifier: ", societe_personnes.societe);
                    console.log("Personnes a modifier: ", societe_personnes.personnes);

                    // Generer une ligne societe
                    genererUneSociete(societe_personnes.societe, societe_personnes.personnes);
                }
            });
        });
    });

    // MODAL: Ajouter une personne a la societe
    $("#editSocieteModal").on("click", "#btnModalAjoutPersonne", function () {
        $this = $(this); // .btn-edit

        // Societe en cours
        const idSociete = $this.parents(".modal-content").find("input[name=idSociete]").val();

        // Générer une ligne de personne
        $tr = $("<tr>"
            + "<td><input type='text' name='idPersonne' value='' class='form-control'></td>"
            + "<td><input type='text' name='nom' class='form-control'></td>"
            + "<td><input type='text' name='prenom' class='form-control'></td>"
            + "<td><input type=''text' name='poids' class='form-control'></td>"
            + "<td><input type='text' name='taille' class='form-control'></td>"
            + "<td><select name='sexe' class='form-control genre'><option value='MASCULIN'>MASCULIN</option><option value='FEMININ'>FEMININ</option></select><input type='text' name='sexe' value='' class='form-control' style='display:none'></td>"
            + "<td><a href='#' title='Ajouter une personne' class='btn btn-primary btn-modal-add' data-idpersonne='" + idSociete + "'><i class='material-icons md-24'>add</i></a></td>"
            + "<td><a href='#' title='Annuler' class='btn btn-secondary btn-modal-cancel'><i class='material-icons md-24'>cancel</i></a></td>"
            + "</tr>");

        $("#personnesModalTbody").append($tr);


        // Récuperer la saisie et inserer dans la base via ajax
        $("#editSocieteModal").on("click", ".btn-modal-add", function () {
            $this = $(this);
            // Change button appearance
            if ($this.find("i").text() == "add" && $this.hasClass("btn-primary")) {

                $this.attr("title", "Modifier cette personne");
                $this.removeClass("btn-primary btn-modal-add").addClass("btn-success btn-modal-edit");
                $this.find("i").html("edit");

                $this.parent("td").next().find("a").attr("title", "Supprimer cette personne");
                $this.parent("td").next().find("a").removeClass("btn-modal-cancel").addClass("btn-modal-delete");
                $this.parent("td").next().find("a i").html("delete_forever");

                // Remove "readonly"
                $this.parent("td").closest("tr").find("select[name=sexe]").hide('fast');
                $this.parent("td").closest("tr").find("input[name=sexe]").val($this.parent("td").closest("tr").find("select[name=sexe]").val()).show('fast').attr("readonly", "readonly");
                $this.parent("td").closest("tr").find("input[name=idPersonne], input[name=nom], input[name=prenom], input[name=poids], input[name=taille]").attr("readonly", "readonly");

                // Get inputs values
                const idPersonne = $(this).closest("tr").find("input[name=idPersonne]").val().trim();
                const nom = $(this).closest("tr").find("input[name=nom]").val().trim();
                const prenom = $(this).closest("tr").find("input[name=prenom]").val().trim();
                const poids = $(this).closest("tr").find("input[name=poids]").val().trim();
                const taille = $(this).closest("tr").find("input[name=taille]").val().trim();
                const sexe = $(this).closest("tr").find("input[name=sexe]").val();
                const idSociete = $("#societeModal").find("input[name=idSociete]").val();

                // Insert Personne

                if (idPersonne !== "" && nom !== "" && prenom !== "" && poids !== "" && taille !== "" && sexe !== "") {
                    let personne = {
                        ID_Personne: idPersonne,
                        Nom: nom,
                        Prenom: prenom,
                        Poids: poids,
                        Taille: taille,
                        Sexe: sexe,
                        ID_SOCIETE: idSociete
                    };

                    console.log("Personne to insert: ", personne);

                    $.ajax({
                        url: "/personnes/create",
                        type: "POST",
                        ContentType: ("application/json"),
                        dataType: "JSON",
                        data: {personne: JSON.stringify(personne)},
                        success: function (personnes, status) {
                            // alert(status);
                            console.log("Les personnes d'une societe: ", personnes);
                        }
                    });
                }

            } else {
                // Changer apparence bouton
                $this.empty().text("border_color");
                $this.closest("a").addClass("btn-warning");

                // Add "readonly"
                $this.closest("tr").find("input[name=nom], input[name=prenom], input[name=poids], input[name=taille], input[name=sexe]").removeAttr("readonly");

            }

        });



    });

    // MODAL: Annuler ajout personne
	$("#editSocieteModal").on("click", ".btn-modal-cancel", function() {
		$(this).closest("tr").remove();
    });

    // MODAL: Modifier et mettre a jour une personne
	$("#editSocieteModal").on("click", ".btn-modal-edit", function() {

		if($(this).find("i").text() === "edit" && $(this).closest("a").hasClass("btn-success")) {
			// Change button appearance
			$(this).find("i").empty().text("border_color");
			$(this).closest("a").addClass("btn-warning");

			// Remove "readonly"
			$(this).closest("tr").find("input[name=nom], input[name=prenom], input[name=poids], input[name=taille], input[name=sexe]").removeAttr("readonly");


		} else {
			// Changer apparence bouton
			$(this).find("i").empty().text("edit");
			$(this).closest("a").removeClass("btn-warning");

			// Add "readonly"
			$(this).closest("tr").find("input[name=nom], input[name=prenom], input[name=poids], input[name=taille], input[name=sexe]").attr("readonly", "readonly");

		}

		$(this).find("i:contains('border_color')").on("click", function() {
			// Get inputs values
			const idPersonne = $(this).closest("tr").find("input[name=idPersonne]").val().trim();
			const nom = $(this).closest("tr").find("input[name=nom]").val().trim();
			const prenom = $(this).closest("tr").find("input[name=prenom]").val().trim();
			const poids = $(this).closest("tr").find("input[name=poids]").val().trim();
			const taille = $(this).closest("tr").find("input[name=taille]").val().trim();
			const sexe = $(this).closest("tr").find("input[name=sexe]").val().trim();

            const personne = {
                ID_Personne: idPersonne,
                Nom: nom,
                Prenom: prenom,
                Poids: poids,
                Taille: taille,
                Sexe: sexe,
                ID_SOCIETE: $("#societeModal").find("input[name=idSociete]").val()
            }

			// Update
			$.ajax({
				url: "/personnes/put",
                type: "PUT",
                ContentType: "application/json",
                data: {personne: JSON.stringify(personne)},
				dataType: "JSON",
				success: function(res, status) {
					// alert(res);
				}
			});
		});
    });

	// MODAL: Supprimer une personne d une societe
	$("#editSocieteModal").on("click", ".btn-modal-delete", function() {
		$this = $(this);

		const idSociete = $("#editSocieteModal").find("input[name=idSociete]").val();
		const idPersonne = $(this).closest("tr").find("input[name=idPersonne]").val();
		// alert(idSociete + "" + idPersonne)

		$.ajax({
			url: "/personnes/" + idPersonne,
			type: "DELETE",
			dataType: "JSON",
			success: function(res, status) {
				// alert(status);

				$this.closest("tr").remove();

			}
		});

	});

	// MODAL: Mettre a jour societe et ses employes
	$("#editSocieteModal").on("click", '#btnModalMaj', function() {


		//$('#editSocieteModal').on('hidden.bs.modal', function (e) {

			// Societe
			const idSocieteTxt = $('#editSocieteModal').find("input[name=idSociete]").val().trim();
            const nomTxt = $('#editSocieteModal').find("input[name=nomSocieteTxt]").val().trim();
            const activiteSocieteTxt = $('#editSocieteModal').find("input[name=activiteSocieteTxt]").val().trim();
			const caSocieteTxt = $('#editSocieteModal').find("input[name=caSocieteTxt]").val().trim();

			let societeToUpdate = {
                ID_SOCIETE: idSocieteTxt,
                Nom: nomTxt,
                Activite: activiteSocieteTxt,
                CA: caSocieteTxt
            }

			// Update la societe seule sans les personnes
			$.ajax({
				url : "/societes/put",
				type : "PUT",
                dataType : "JSON",
                data: {societe: JSON.stringify(societeToUpdate)},
				success : function(societes, status) {
                    console.log("Mise à jour avec succes: ", societes);
                    genererSocietes(societes.societes);

                    // Reactualiser affichage a la ferture du formulaire ajout
                    $("#editSocieteModal").on('hidden.bs.modal', function () {
                        // Fermer le modal d'edition eleve

                        // Icone du bouton "btn-voir" sur "visibility_off" pour eleve courant
                        $("#societesTbody")
                        .find(".btn-voir[data-idsociete=" + idSocieteTxt + "]").addClass("btn-success")
                            .find("i").empty().text("visibility_off").end()
                            .trigger("click"); // Reactualiser l'affichage des personnes
                    });


				}
            });

            $('#editSocieteModal').modal('hide');
		//});
	});
























});
