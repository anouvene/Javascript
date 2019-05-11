$(function() {
	// Génerer tableau eleves
	GenerationTableauEleves(tblEleves , $("#eleveTbody"));
	
	// Ajouter eleve
	$("#btnAddEleve").on("click", function() {

		$tr = insererLigneEleve({ 
			nom: $("#txtNom").val(), 
			prenom: $("#txtPrenom").val()
		});
		
		// Insert tr dans table
		$("#eleveTbody").append($tr);
		
		// Vider les champs
		$("#txtIdEleve").val("");
		$("#txtNom").val("");
		$("#txtPrenom").val("");
		
		// Fermer le formulaire d'edition
		$('#collapseEleveFormAjout').collapse('hide');
		
		
		// Nouveau table eleves
		// console.log(tblEleves);
		
	});
		
	// Supprimer un eleve
	$("#eleveTbody").on("click", ".btn-delete", function() {
		let id = $(this).closest(".text-success").find("a.btn-voir").attr("data-ideleve");
		
		let eleve = RecupereElementDuTableau(tblEleves, id);
		let posEleve = tblEleves.findIndex( e => e.idEleve == id);
		// console.log(posEleve);
		
		// Supprimer eleve
		tblEleves.splice(posEleve, 1);

		// Regenerer l'affichage tableau
		GenerationTableauEleves(tblEleves , $("#eleveTbody"));

		// Vider et fermer notesTbody
		$("#notesTbody").empty();
		$("#collapseNotes").collapse("hide");
		
		
	});
			
	// MODAL: Modifier un eleve	et ses notes
	$("#eleveTbody").on("click", ".btn-edit", function() { // Delegate event click
		$this = $(this); // .btn-edit
		
		// Fermer collapse notes
		$("#collapseNotes").collapse("hide");
		
		// Eleve en cours	
		let id = $this.closest(".text-success").find("a.btn-voir").attr("data-ideleve");		
		let eleve = RecupereElementDuTableau(tblEleves, id);		
		
		$('#editEleveModal').on('shown.bs.modal', function (e) {
			$(this).css({"padding-right": "0px", "display" :" block"}); // enlever padding-right du modal
			
			$(this).find("#notesEleveTbody").empty();
			
			
			
			$(this).find("input[name=idEleve]").val(eleve.idEleve);
			$(this).find("input[name=nom]").val(eleve.nom);
			$(this).find("input[name=prenom]").val(eleve.prenom);
		  
			// Notes
			notes = JSON.parse(getNotes(id));
			
			// Générer les lignes de notes
			for(note of notes) {
				$tr = $("<tr>"
						+ "<td>" + "<input type='text' id='inputIdNote' name='idNote' value='" + note.idNote + "' class='form-control' readonly>" + "</td>"
						// + "<td>" + "<input type='text' id='inputIdNote' name='idEleve' value='" + note.idEleve + "' class='form-control' readonly>" + "</td>"
						+ "<td>" + "<input type='text' name='matiere' value='" + note.matiere +  "' class='form-control' readonly>" + "</td>"
						+ "<td>" + "<input type='text' name='coef' value='" + note.coef + "' class='form-control' readonly>"+ "</td>"
						+ "<td>" + "<input type=''text' name='valeur' value='" + note.valeur + "' class='form-control' readonly>" +"</td>"
						+ "<td>" + "<input type='text' name='dateExam' value='" + note.dateExam +"' class='form-control' readonly>" +"</td>"
						+ "<td><a href='#note' title='Modifier une note' class='btn btn-success btn-modal-edit' "
						+ "data-toggle='collapse' data-target='#collapseNoteFormEdit'><i class='material-icons md-24'>edit</i></a></td>"			  
						+ "<td><a href='#note' title='Supprimer une note' class='btn btn-danger btn-delete'><i class='material-icons md-24'>delete_forever</i></a></td>"						
						+ "</tr>");
				
				$tr.appendTo($("#notesEleveTbody"));
			}
		});
	});
	
	// MODAL: ajouter une ligne de note a un eleve
	$("#btnModalAjoutNote").on("click", function() {
		$this = $(this); // .btn-edit
		let id = $this.parents(".modal-content").find("input[name=idEleve]").val();
		
		// Eleve en cours			
		let eleve = RecupereElementDuTableau(tblEleves, id);
		const nbNotes = eleve.notes.length;
		
		// Générer les lignes de notes		
		$tr = $("<tr>"
				// + "<td>" + "<input type='text' id='inputIdNote' name='idEleve' class='form-control'>" + "</td>"
				+ "<td>" + "<input type='text' id='inputIdEleve' name='idNote' value='" + (nbNotes + 1) + "' class='form-control' readonly>" + "</td>"
				+ "<td>" + "<input type='text' name='matiere' class='form-control'>" + "</td>"
				+ "<td>" + "<input type='text' name='coef' class='form-control'>"+ "</td>"
				+ "<td>" + "<input type=''text' name='valeur' class='form-control'>" +"</td>"
				+ "<td>" + "<input type='text' name='dateExam' class='form-control'>" +"</td>"
				+ "<td><a href='#note' title='Modifier une note' class='btn btn-success btn-warning btn-modal-edit edit-bis' "
				+ "data-toggle='collapse' data-target='#collapseNoteFormEdit'><i class='material-icons md-24'>border_color</i></a></td>"			  
				+ "<td><a href='#note' title='Supprimer une note' class='btn btn-danger btn-delete'><i class='material-icons md-24'>delete_forever</i></a></td>"						
				+ "</tr>");
		
		$tr.appendTo($("#notesEleveTbody"));
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

	// MODAL: Mettre a jours eleve et ses notes dans la bases
	$('#btnModalMaj').on("click", function() {
		// Fermer le modal d'edition eleve
		$('#editEleveModal').modal('hide');
		
		$('#editEleveModal').on('hidden.bs.modal', function (e) {
			
			// Eleve
			const idEleveTxt = $(this).find("input[name=idEleve]").val();
			const nomTxt = $(this).find("input[name=nom]").val();
			const prenomTxt = $(this).find("input[name=prenom]").val();
			
			// const EleveCourant = RecupereElementDuTableau(tblEleves, idEleveTxt);
			let eleveToUpdate = null;
			
			eleveNotesToUpdate = [];
			$("#notesEleveTbody tr").each(function(){
				// eleve notes
				let idNoteTxt = $(this).find("input[name=idNote]").val();
				let matiereTxt = $(this).find("input[name=matiere]").val();
				let coefTxt = $(this).find("input[name=coef]").val();
				let valeurTxt = $(this).find("input[name=valeur]").val();
				let dateExamTxt = $(this).find("input[name=dateExam]").val();
				
				let note = { 
					idNote: idNoteTxt, 
					valeur: valeurTxt, 
					coef: coefTxt, 
					matiere: matiereTxt, 
					dateExam: dateExamTxt
				};
				
				eleveNotesToUpdate.push(note);
				
			});
			
			eleveToUpdate = {
					idEleve: idEleveTxt,
					nom: nomTxt,
					prenom: prenomTxt,
					notes: eleveNotesToUpdate
			};
			//console.log("id eleve to update", idEleveTxt);
			//console.log("Eleve to update", eleveToUpdate);
			
			// Position de eleveToUpdate dans le tableau eleves (tblEleves)
			const pos = tblEleves.findIndex(e => eleveToUpdate.idEleve == e.idEleve);
			
			// Mettre à jour la table tblEleves
			tblEleves.splice(pos, 1, eleveToUpdate);
			
			// Regénérer l'affichage des éléve dans la page accueil
			GenerationTableauEleves(tblEleves , $("#eleveTbody"));

			// Regénérer l'affichage des notes
			GenerationTableauNotesDunEleve(eleveToUpdate , $("#notesTbody"));
			$("#collapseNotes").collapse("show");
			
			
		});
		
	});
		
	// Voir les notes d un eleve
	$("#eleveTbody").on("click", ".btn-voir", function() {
		// Infos eleve
		const id = $(this).attr("data-ideleve");
		const eleve = RecupereElementDuTableau(tblEleves, id);

		// Generer les tr notes
		GenerationTableauNotesDunEleve(eleve , $("#notesTbody"));
	});
	
	
	
	
	
});