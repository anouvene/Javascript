let tblEleves = [
	{idEleve :1,nom:"prost",prenom:"Alain",notes:[
		{idNote:1,valeur:18 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:2,valeur:15 , coef:3 , matiere:"INFO",dateExam:"13/03/2019"},
		{idNote:3,valeur:12 , coef:3 , matiere:"ANGLAIS",dateExam:"15/03/2019"}
	
	]} ,
	{idEleve :2,nom:"Zidane",prenom:"Zinedine",notes:[
	    {idNote:4,valeur:20 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:5,valeur:19 , coef:3 , matiere:"INFO",dateExam:"13/03/2019"},
		{idNote:6,valeur:16 , coef:3 , matiere:"ANGLAIS",dateExam:"15/03/2019"}
	
	]} ,
	{idEleve :3,nom:"Schumacher",prenom:"Michael",notes:[
		{idNote:7,valeur:10 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:8,valeur:11 , coef:3 , matiere:"INFO",dateExam:"13/03/2019"},
		{idNote:9,valeur:12 , coef:3 , matiere:"ANGLAIS",dateExam:"15/03/2019"}
	
	
	]}
	,
	{idEleve :4,nom:"VETTEL",prenom:"SEBASTIAN",notes:[
		{idNote:10,valeur:20 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:11,valeur:20 , coef:3 , matiere:"INFO",dateExam:"13/03/2019"},
		{idNote:12,valeur:20 , coef:3 , matiere:"ANGLAIS",dateExam:"15/03/2019"}						
	
	]}
	,
	{idEleve :5,nom:"ALESI",prenom:"JEAN",notes:[
		{idNote:13,valeur:05 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:14,valeur:05 , coef:3 , matiere:"INFO",dateExam:"13/03/2019"},
		{idNote:15,valeur:05 , coef:3 , matiere:"PHP7",dateExam:"15/03/2019"}
	
	
	]}
	,
	{idEleve :6,nom:"VALBUENA",prenom:"JEAN",notes:[
		{idNote:16,valeur:05 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:17,valeur:05 , coef:3 , matiere:"INFO",dateExam:"13/03/2019"},
		{idNote:18,valeur:05 , coef:3 , matiere:"CHIMIE",dateExam:"15/03/2019"}
	
	
	]}
	,
	{idEleve :7,nom:"FEKIR",prenom:"NABIL",notes:[
		{idNote:19,valeur:05 , coef:4 , matiere:"MATHS",dateExam:"18/02/2019"},
		{idNote:20,valeur:05 , coef:3 , matiere:"JAVA",dateExam:"13/03/2019"},
		{idNote:21,valeur:05 , coef:3 , matiere:"BIO",dateExam:"15/03/2019"}
	
	
	]}
];



function GenerationTableauEleves(tableauDeDonnees , composantGraphiqueParent)
{
	composantGraphiqueParent.empty();
	
	for(eleve of tableauDeDonnees)
	{
		$tr = $("<tr>"
			+ "<td>" + eleve.idEleve + "</td>"
			+ "<td>" + eleve.nom + "</td>"
			+ "<td>" + eleve.prenom + "</td>"
			+ "<td class='text-success'>"
			+ "<a href='#collapseNote' title='Voir les notes' class='btn btn-success btn-voir' data-ideleve='" + eleve.idEleve + "'" 
			+ "data-toggle='collapse' data-target='#collapseNotes'><i class='material-icons md-24'>notes</i></a> "	
			+ "<a href='#eleve' title='Modifier un élève' class='btn btn-warning btn-edit'"	
			+ "data-toggle='modal' data-target='#editEleveModal'><i class='material-icons md-24'>edit</i></a> "	  
			+ "<a href='#eleve' title='Supprimer un élève' class='btn btn-danger btn-delete'><i class='material-icons md-24'>delete_forever</i></a>"									
			+ "</td>"
			+ "</tr>");
	  

	composantGraphiqueParent.append($tr);
	}			
	
}

// Retiurner un eleve sinon undefined
function RecupereElementDuTableau(tableau,id)
{
	return tableau.find(elem => elem.idEleve == id);
}
	

	
	
	
	
	
	

