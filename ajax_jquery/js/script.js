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
	
	// Insérer une nouvelle ligne tr Eleve
	function insererLigneEleve(valeurs) {
		const {nom, prenom} = valeurs;
		
		let nbEleves = tblEleves.length + 1;
				
		if(nom !== "" && prenom .trim() !== "") {
			tdIdEleve = "<td>"+ nbEleves +"</td>";
			tdNom = "<td>"+ nom +"</td>";
			tdPrenom ="<td>"+ prenom +"</td>";
			
			tdActions =  "<td class='text-success'>";
			tdActions += "<a href='#collapseNote' title='Voir les notes' class='btn btn-success btn-voir' data-ideleve='" + nbEleves + "' data-toggle='collapse' data-target='#collapseNotes'><i class='material-icons md-24'>notes</i></a> ";
			tdActions += "<a href='#eleve' title='Modifier un élève' class='btn btn-warning btn-edit' data-toggle='modal' data-target='#editEleveModal'><i class='material-icons md-24'>edit</i></a>" ;
			tdActions += " <a href='#eleve' title='Supprimer un élève' class='btn btn-danger btn-delete'><i class='material-icons md-24'>delete_forever</i></a></td>";
			
			$tr = $("<tr data-toggle='collapse' data-target='#eleve_" + nbEleves +"' class='accordion-toggle'>" 
					+ tdIdEleve 
					+ tdNom 
					+ tdPrenom
					+ tdActions
					+ "</tr>");
			
			let eleve = null;
			
			eleve = { "idEleve": nbEleves, "nom": nom, "prenom": prenom, "notes": [] };
			
			// remplir le tableau eleves
			tblEleves.push(eleve);
			
			return $tr;
		}
	}
	
	// Supprimer un eleve
	$("#eleve_form").on("click", ".btn-delete", function() {
		let id = $(this).closest(".text-success").find("a.btn-voir").attr("data-ideleve");
		
		let eleve = getEleve(id);
		let posEleve = tblEleves.findIndex( e => e.idEleve == id);
		console.log(posEleve);
		
		// Supprimer eleve
		tblEleves.splice(posEleve, 1);

		
		GenerationTableauEleves(tblEleves , $("#eleveTbody"));
		
		
	});
			
	// MODAL: Modifier un eleve	et ses notes
	$("#eleve_form").on("click", ".btn-edit", function() { // Delegate event click
		$this = $(this); // .btn-edit
		let id = $this.closest(".text-success").find("a.btn-voir").attr("data-ideleve");
		
		// Eleve en cours			
		let eleve = JSON.parse(getEleve(id));		
//		console.log("eleve", eleve);	
//		console.log("Id : ", id);
		
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
		let eleve = JSON.parse(getEleve(id));
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
			
			// Remove readonly attribute
//			if($(this).hasClass("edit-bis")) { // Si nouvelle ligne note créee				
//				$(this).closest("tr").find("input[name=idNote], input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").removeAttr("readonly");				
//			} else {
//				$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").removeAttr("readonly");
//			}
			
		} else {
			$(this).find("i").empty().text("edit");
			$(this).closest("a").removeClass("btn-warning");
			
			$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").attr("readonly", "readonly");	
			
			$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").attr("readonly", "readonly");	
			
			// Add readonly attribute
//			if($(this).hasClass("edit-bis")) { // Si nouvelle ligne note créee
//				$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").attr("readonly", "readonly");	
//			} else {
//				$(this).closest("tr").find("input[name=matiere], input[name=coef], input[name=valeur], input[name=dateExam]").attr("readonly", "readonly");
//			}
			
		}
	});

	
	// MODAL: Mettre a jours eleve et ses notes dans la bases
	$('#btnModalMaj').on("click", function() {
		// Fermer le formulaire d'edition
		$('#editEleveModal').modal('hide');
		
		$('#editEleveModal').on('hidden.bs.modal', function (e) {
			
			
			// Eleve
			const idEleveTxt = $(this).find("input[name=idEleve]").val();
			const nomTxt = $(this).find("input[name=nom]").val();
			const prenomTxt = $(this).find("input[name=prenom]").val();
			
			const EleveCourant = JSON.parse(getEleve(idEleveTxt));
			let eleveToUpdate = null;
			
			tblNotes = [];
			$("#notesEleveTbody tr").each(function(){
				// eleve notes
				let matiereTxt = $(this).find("input[name=matiere]").val();
				let coefTxt = $(this).find("input[name=coef]").val();
				let valeurTxt = $(this).find("input[name=valeur]").val();
				let dateExamTxt = $(this).find("input[name=dateExam]").val();
				
				let note = { 
					idNote: EleveCourant.notes.length + 1, 
					valeur: valeurTxt, 
					coef: coefTxt, 
					matiere: matiereTxt, 
					dateExam: dateExamTxt
				};
				
				tblNotes.push(note);
				
			});
			
			eleve = {
					idEleve: idEleveTxt,
					nom: nomTxt,
					prenom: prenomTxt,
					notes: tblNotes
			};
			
			
			console.log(eleve);
			const pos = tblEleves.findIndex(e => e.idEleve == eleve.idEleve);
			
			// Mettre à jour la table tblEleves
			tblEleves.splice(pos, 1, eleve);
			
			// Regénérer l'affichage
			GenerationTableauEleves(tblEleves , $("#eleveTbody"));
			
			
		});
		
	});
	
	
	
	
	// Retourner un eleve by id eleve
	function getEleve(id) {
		let eleve = null;
		
		for(e of tblEleves) {			
			if(e.idEleve == id) {
				eleve = e;
			}
		}
		
		return JSON.stringify(eleve);
	}
	
	// Retourner les notes eleve by id eleve
	function getNotes(id) {
		
		const eleve = JSON.parse(getEleve(id));
		const notesEleve = eleve.notes;
		
		return JSON.stringify(notesEleve);
	}
	
	// Voir les notes de eleve
	$("#eleve_form").on("click", ".btn-voir", function(){
		$("#notesTbody").empty(); // Vider le bloc tbody
		
		idEleve = $(this).attr("data-ideleve");
		
		//$('#collapseNotes').on('show.bs.collapse', function () {}			
		// console.log(getNotes(idEleve));
		const notes = JSON.parse(getNotes(idEleve));
		let $tr = null;
		
		// Générer les lignes de notes
		for(note of notes) {
			$tr = $("<tr>"
					+ "<td>" + note.idNote + "</td>"
					+ "<td>" + note.idEleve + "</td>"
					+ "<td>" + note.matiere + "</td>"
					+ "<td>" + note.coef + "</td>"
					+ "<td>" + note.valeur +"</td>"
					+ "<td>" + note.dateExam +"</td>"						
					+ "</tr>");
			
			$tr.prependTo($("#notesTbody"));
		}
	});
	
	
	
	
	
});