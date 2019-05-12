$(function() {
	// Génerer tableau eleves
	GenererTableauEleves(tblEleves , $("#eleveTbody"));
	
	// Ajouter eleve
	$("#btnAddEleve").on("click", function() {

		const nomTxt = $("#txtNom").val().trim();
		const prenomTxt = $("#txtPrenom").val().trim();

		if(nomTxt !== "" && prenomTxt !== "") {
			// Nouvel eleve
			const eleve = {
				idEleve: tblEleves.length + 1,
				nom: nomTxt,
				prenom: prenomTxt,
				notes: []
			}

			// Ajouter eleve dans la table tblEleves
			tblEleves.push(eleve);
		}
		
		// Vider les champs
		$("#txtIdEleve").val("");
		$("#txtNom").val("");
		$("#txtPrenom").val("");
		
		// Fermer le formulaire d'edition
		$('#collapseEleveFormAjout').collapse('hide');

		// Reactualiser l affichage des eleves
		GenererTableauEleves(tblEleves , $("#eleveTbody"));
		
	});

	// Voir les notes d un eleve
	$("#eleveTbody").on("click", ".btn-voir", function() {
		$(".btn-voir").removeClass("btn-success");
		$(".btn-voir").find("i").empty().text("visibility");

		// Infos eleve
		const id = $(this).attr("data-ideleve");
		const eleve = RecupereElementDuTableau(tblEleves, id);

		// Changer l'apparence du bouton
		if($(this).find("i").text() == "visibility") {
			$(this).addClass("btn-success");
			$(this).find("i").empty().text("visibility_off");
		} else {
			$(this).removeClass("btn-success");
			$(this).find("i").empty().text("visibility");

			$("#collapseNotes").collapse('hide');
		}

		// Generer les tr notes
		GenererTableauNotesDunEleve(eleve , $("#notesTbody"));

		// Reouvrir immediatement le bloc collapseNotes when il est fermé
		$('#collapseNotes').on('hidden.bs.collapse', function () {
			$(this).collapse("show");
		});
	});
		
	// Supprimer un eleve
	$("#eleveTbody").on("click", ".btn-delete", function() {
		const id = $(this).closest(".actions").find("a.btn-voir").attr("data-ideleve");
		const eleve = RecupereElementDuTableau(tblEleves, id);
		const posEleve = tblEleves.findIndex( e => e.idEleve == id);
		
		// Supprimer eleve
		const eleveDeleted = tblEleves.splice(posEleve, 1);

		// Reactualiser l'affichage tableau
		GenererTableauEleves(tblEleves , $("#eleveTbody"));

		// Vider et fermer notesTbody
		$("#notesTbody").empty();
		$("#collapseNotes").removeClass("show");
		
		
	});
			
	// MODAL: Modifier un eleve	et ses notes
	$("#eleveTbody").on("click", ".btn-edit", function() { // Delegate event click
		$this = $(this); // .btn-edit

		console.log("Nouveau tableau: ", tblEleves);

		
		// Fermer collapse notes
		$("#collapseNotes").collapse("hide");
		
		// Eleve en cours	
		let id = $this.closest(".actions").find("a.btn-voir").attr("data-ideleve");		
		let eleve = RecupereElementDuTableau(tblEleves, id);		
		
		$('#editEleveModal').on('shown.bs.modal', function (e) {
			$(this).css({"padding-right": "0px", "display" :" block"}); // enlever padding-right du modal
			
			$(this).find("#notesModalTbody").empty();
			
			$(this).find("input[name=idEleve]").val(eleve.idEleve);
			$(this).find("input[name=nom]").val(eleve.nom);
			$(this).find("input[name=prenom]").val(eleve.prenom);
		  
			// Notes
			notes = eleve.notes;
			
			// Générer lignes de notes d'un eleve
			GenererModalTableauNotesDunEleve(notes , $("#notesModalTbody"));
		});
	});
	
	// MODAL: Ajouter une ligne de note a un eleve
	$("#btnModalAjoutNote").on("click", function() {
		$this = $(this); // .btn-edit

		// Eleve en cours
		const id = $this.parents(".modal-content").find("input[name=idEleve]").val();		
		const eleve = RecupereElementDuTableau(tblEleves, id);

		// Générer les lignes de notes
		const nbNotes = eleve.notes.length;
			
		// Générer les lignes de notes		
		$tr = $("<tr>"
				+ "<td>" + "<input type='text' name='idNote' value='" + (nbNotes + 1) + "' class='form-control' readonly>" + "</td>"
				+ "<td>" + "<input type='text' name='matiere' class='form-control'>" + "</td>"
				+ "<td>" + "<input type='text' name='coef' class='form-control'>"+ "</td>"
				+ "<td>" + "<input type=''text' name='valeur' class='form-control'>" +"</td>"
				+ "<td>" + "<input type='text' name='dateExam' class='form-control'>" +"</td>"				
				+ "<td><a href='#' title='Modifier une note' class='btn btn-success btn-warning btn-modal-edit'><i class='material-icons md-24'>border_color</i></a></td>"
				+ "<td><a href='#' title='Annuler' class='btn btn-secondary btn-modal-cancel'><i class='material-icons md-24'>cancel</i></a></td>"		  
				// + "<td><a href='#' title='Supprimer une note' class='btn btn-danger btn-modal-delete'><i class='material-icons md-24'>delete_forever</i></a></td>"						
				+ "</tr>");
		
		$tr.appendTo($("#notesModalTbody"));

		
	});	

	// MODAL: Annuler ajout note
	$("#editEleveModal").on("click", ".btn-modal-cancel", function(){
		$(this).closest("tr").remove();
	});
	
	// MODAL: Modifier ligne note
	$("#editEleveModal").on("click", ".btn-modal-edit", function() {
		
		if($(this).find("i").text() === "edit" && $(this).closest("a").hasClass("btn-success")) {
			// Change button appearance
			$(this).find("i").empty().text("border_color");
			$(this).closest("a").addClass("btn-warning");
			
			$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").removeAttr("readonly");
						
		} else {
			$(this).find("i").empty().text("edit");
			$(this).closest("a").removeClass("btn-warning");
			
			$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").attr("readonly", "readonly");	
			
			$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").attr("readonly", "readonly");	
			
		}
	});

	// MODAL: Mettre a jours eleve et ses notes
	$('#btnModalMaj').on("click", function() {
		// Fermer le modal d'edition eleve
		$('#editEleveModal').modal('hide');
		
		$('#editEleveModal').on('hidden.bs.modal', function (e) {
			
			// Eleve
			const idEleveTxt = $(this).find("input[name=idEleve]").val();
			const nomTxt = $(this).find("input[name=nom]").val().trim();
			const prenomTxt = $(this).find("input[name=prenom]").val().trim();
			
			// const EleveCourant = RecupereElementDuTableau(tblEleves, idEleveTxt);
			let eleveToUpdate = null;
			
			eleveNotesToUpdate = [];
			$("#notesModalTbody tr").each(function(){
				// eleve notes
				let idNoteTxt = $(this).find("input[name=idNote]").val();
				let matiereTxt = $(this).find("input[name=matiere]").val().trim();
				let coefTxt = $(this).find("input[name=coef]").val().trim();
				let valeurTxt = $(this).find("input[name=valeur]").val().trim();
				let dateExamTxt = $(this).find("input[name=dateExam]").val().trim();

				// Champs note non vides
				if(matiereTxt !== "" && coefTxt !== "" && valeurTxt !== "" && dateExamTxt !== "") {
					let note = { 
						idNote: idNoteTxt, 
						valeur: valeurTxt, 
						coef: coefTxt, 
						matiere: matiereTxt, 
						dateExam: dateExamTxt
					};

					eleveNotesToUpdate.push(note);
				}
			});
			
			eleveToUpdate = {
					idEleve: idEleveTxt,
					nom: nomTxt,
					prenom: prenomTxt,
					notes: eleveNotesToUpdate
			};
			
			// Position de eleveToUpdate dans le tableau eleves (tblEleves)
			const pos = tblEleves.findIndex(e => eleveToUpdate.idEleve == e.idEleve);
			
			// Mettre à jour la table tblEleves
			tblEleves.splice(pos, 1, eleveToUpdate);
			
			// Regénérer l'affichage des éléve dans la page accueil
			GenererTableauEleves(tblEleves , $("#eleveTbody"));

			// Icone du bouton "btn-voir" sur "visibility_off" pour eleve courant
			$("#eleveTbody")
				.find(".btn-voir[data-ideleve=" + eleveToUpdate.idEleve + "]").addClass("btn-success")
					.find("i").empty().text("visibility_off");

			// Reactualiser l'affichage des notes
			GenererTableauNotesDunEleve(eleveToUpdate , $("#notesTbody"));
			$("#collapseNotes").collapse("show");			
			
		});
		
	});

	// MODAL: Supprimer une note d un eleve
	$("#editEleveModal").on("click", ".btn-modal-delete", function() {
		const id_note = $(this).closest("tr").find("input[name=idNote]").val();
		const id_eleve = $("#editEleveModal").find("input[name=idEleve]").val();

		const eleve = RecupereElementDuTableau(tblEleves, id_eleve);
		const posNoteToDelete = eleve.notes.findIndex( n => n.idNote == id_note);

		// Supprimer note eleve
		eleve.notes.splice(posNoteToDelete, 1);

		console.log(eleve.notes);

		// Réactualiser l'affichage des notes
		GenererModalTableauNotesDunEleve(eleve.notes, $("#notesModalTbody"));

	});
		
	// Scroll to bloc collapseNotes
	$('#collapseNotes').on('shown.bs.collapse', function () {
		this.scrollIntoView();
	});
	
});