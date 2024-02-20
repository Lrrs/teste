



var jsonArray = null; // Initialisez jsonArray à null.
var jsonBruite =null;
var jsonClnFltr =null;
const colonnesAInclure = ['sName', 'Date', 'Time'];
let init_date ='2023-10-04';
let fin_date ='2023-10-05';
let titre ="Pointage"

// Heures au format "HH:mm"
let heure1 = "18:00";
let heure2 = "06:00";



let objetsActifs1 = []; // Déclaration du tableau pour stocker les objets filtrés
let objetsActifs2 = []; // Déclaration du tableau pour stocker les objets filtrés
let objetsActifs = []; // Déclaration du tableau pour stocker les objets filtrés






// Fonction pour convertir une heure "HH:mm" en minutes depuis minuit
function heureEnMinutes(heure) {
    const [heures, minutes] = heure.split(":").map(Number);
    return heures * 60 + minutes;
}


document.getElementById("importerCSV").addEventListener("click", function() {

    formBlock.style.display = 'none';
    tableBlock.style.display = 'block';

    const fichierCSV = document.getElementById("fichierCSV").files[0];
      // Récupérer les valeurs des champs
      init_date = document.getElementById("dateIni").value;
      heure1 = document.getElementById("heureIni").value;
      fin_date = document.getElementById("dateFin").value;
      heure2 = document.getElementById("heureFin").value;

      const champSaisie = document.getElementById('champSaisie');
      const affichageValeur = document.getElementById('affichageValeur');

      
      // Afficher la valeur dans le label
      affichageValeur.textContent = 'Pointage ' +  champSaisie.value +' du ' +init_date ;


      // Faites quelque chose avec les valeurs (par exemple, les afficher dans la console)
      console.log("Date Initiale:", init_date);
      console.log("Heure Initiale:", heure1);
      console.log("Date Finale:", fin_date);
      console.log("Heure Finale:", heure2);



    if (fichierCSV) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const contenuCSV = e.target.result;
            jsonBruite = convertirCSVenJSON(contenuCSV); // Mettez le résultat dans jsonArray

        };
        reader.readAsText(fichierCSV);
    } else {
        alert("Veuillez sélectionner un fichier CSV.");
    }
});

function convertirCSVenJSON(contenuCSV) {
const lignes = contenuCSV.trim().split('\n');
const enTetes = lignes[0].split(',');

const resultats = [];

for (let i = 1; i < lignes.length; i++) {
        const ligne = lignes[i].split(',');
        const objetJSON = {};

        for (let j = 0; j < enTetes.length; j++) {
            const cle = enTetes[j].trim();
            let valeur = ligne[j].trim();
            // Supprimez les guillemets simples autour des valeurs
            valeur = valeur.replace(/^'(.*)'$/, '$1');
            // Remplacez les chaînes de caractères "undefined" par null
            if (valeur === 'undefined') {
                valeur = null;
            }

            objetJSON[cle] = valeur;
        }

        resultats.push(objetJSON);
    }
        

    jsonArray = filtrerJSON(resultats, colonnesAInclure);
        return resultats;
}


function filtrerJSON(jsonData, colonnesAInclure) {
// Vérifie si le JSON est un tableau d'objets
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
    return [];
    }

// Filtrer les colonnes à inclure
const resultatFiltre = jsonData.map((element) => {
const nouvelElement = {};
colonnesAInclure.forEach((colonne) => {
  if (element.hasOwnProperty(colonne)) {
    nouvelElement[colonne] = element[colonne];
  }
});


return nouvelElement;
});



jsonClnFltr=resultatFiltre;

// Convertir init_date et fin_date en objets Date si ce ne sont pas déjà des objets Date
init_date = new Date(init_date);
fin_date = new Date(fin_date);


for (let i = 0; i < jsonClnFltr.length; i++) {
    const objet = jsonClnFltr[i];
    const dateObjet = new Date(objet.Date);
    const timeObjet = objet.Time; // Supposons que Time est une chaîne de caractères au format "HH:mm"

    if (dateObjet >= init_date && dateObjet <= init_date ){
        if( heureEnMinutes(timeObjet) >= heureEnMinutes(heure1)) {
            objetsActifs1.push(objet);
        }
    }
    
    if (dateObjet >= fin_date && dateObjet <= fin_date ){
        if( heureEnMinutes(timeObjet) <= heureEnMinutes(heure2)) {
            objetsActifs2.push(objet);
        }
    }
}


objetsActifs = objetsActifs.concat(objetsActifs1, objetsActifs2);
console.log(objetsActifs)


// Le tableau "filteredData" contient maintenant les éléments sans sName égal à NULL
//var filteredDataF=suppLigne(objetsActifs);
var filteredDataF=objetsActifs;

// Obtenez une référence à la table et au tbody
const tableau = document.getElementById("tabmodel");
const tbody = tableau.querySelector("tbody");

// Supprimez toutes les lignes existantes du tbody
while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
}

return affdata(filteredDataF);
}



function suppLigne(data){
    var filteredData = [];
    var Data=data;
    // Parcourir chaque élément du JSON d'origine
    for (var i = 0; i < Data.length; i++) {
        // Vérifier si la propriété sName n'est pas égale à NULL
        if (Data[i].sName !== "'NULL") {
            // Si elle n'est pas égale à NULL, ajouter l'élément au nouveau tableau
            filteredData.push(Data[i]);
        }
    }
    console.log(filteredData);
    return filteredData;
}


function affdata(data){
            // Obtenez une référence à la table et au tbody
            const tableau = document.getElementById("tabmodel");
            const tbody = tableau.querySelector("tbody");
            // Bouclez à travers les données JSON et insérez-les dans le tableau
            data.forEach(function (element) {
                const ligne = document.createElement("tr"); // Créez une nouvelle ligne

                // Ajoutez chaque propriété de l'objet en tant que cellule de tableau
                for (const cle in element) {
                    if (element.hasOwnProperty(cle)) {
                        const cellule = document.createElement("td");
                        cellule.textContent = element[cle];
                        ligne.appendChild(cellule);
                    }
                }
                // Ajoutez la ligne au tbody
                tbody.appendChild(ligne);
            });
}



/*for wiget */

const formBlock = document.getElementById('formBlock');
const tableBlock = document.getElementById('tableBlock');
const toggleButton1 = document.querySelector('#formBlock .toggle1');
const toggleButton2 = document.querySelector('#tableBlock .toggle2');

// Affiche le bloc de formulaire par défaut au chargement de la page
formBlock.style.display = 'block';


toggleButton1.addEventListener('click', () => {
    formBlock.style.display = 'none';
    tableBlock.style.display = 'block';
});

toggleButton2.addEventListener('click', () => {
    formBlock.style.display = 'block';
    tableBlock.style.display = 'none';
});

/* for controller */
/*
$(document).ready(function(){
    $('.menu').click(function(){
        formBlock.style.display = 'none';
        tableBlock.style.display = 'block';
    })
})
*/

function imprimerFormulaire() {
    window.print(); // Ouvre la boîte de dialogue d'impression
}