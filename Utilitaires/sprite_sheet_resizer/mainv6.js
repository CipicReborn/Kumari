/*
	Author : Benjamin PAGEAUD
	Outil servant à redimensionner des spritessheets sortant de TexturePacker et les jsons qui vont avec
	Utilisation :
	+- Mettre le dossier assets organisé comme bon vous semble dans le dossier images_a_convertir
	+- Spécifier les résolutions voulues et le ratio dans le fichier config.json
	+- Lancer run.bat

	Le processus, peut être un peu long, attendez 
*/

//Dépendences 
var fs = require('fs'); //permet de naviguer dans les dossiers, lire/écrire des fichiers etc..
var mkdirp = require('mkdirp'); //permet d'accéder à des dossiers si ils existent, ou les créer si c'est pas le cas
var lwip = require('lwip'); //lwip@0.0.5 -- permet de modifier des images : resize, rotation, teinte etc..
var colors = require('colors'); //module pour les couleurs dans la console :)
var dive = require('dive'); //Permet de naviguer dans un dossier en profondeur, j'allais pas réinventer la roue :D

var regexImages = /.+\.png$/;
var regexJson   = /.+\.json$/;
var regexImagesAndJson = /.+\.((png)|(json))$/;
//Constantes
const IMAGES_FOLDER = __dirname + '\\to_convert';
const DESTINATION_FOLDER = __dirname + '\\converted\\';

var config = {};
//Récupération des redimensionnements à faire
fs.readFile(__dirname + '/config.json', "utf-8", function (error, file) {
	//Récupération du fichier de config
	config = JSON.parse(file);
	//Exploration du dossier, on fait la liste de tous les fichiers
	listAllFiles();
});



/*
	Dresse la liste de tous les fichiers avec leur path puis effectue les redimensionnement sur chacun des fichiers de la liste
*/
var filesArray = [];
function listAllFiles() {
	dive(IMAGES_FOLDER, function(error, file) { //Callback sur chaque fichier trouvé
		if(regexImagesAndJson.exec(file)) {
			filesArray.push(file);
			console.log('Added ' + file.magenta)
		}
		
	}, function() { //Callback de fin
		console.log("Liste des fichiers OK, ".green + (filesArray.length + ' éléments').bgGreen);
		
		//On effectue les redimensionnements pour chaque fichier
		for(var i = 0; i < filesArray.length; i++) {
			processFile(filesArray[i]);
		}
	});
}

/**
	Execute la fonction qui va bien pour modifier le fichier, en fonction de son extension
	@param le nom du fichier
*/
function processFile(pFileName) {
	if(regexImages.exec(pFileName)) resizeImageForAllSizes(pFileName);
	else if (regexJson.exec(pFileName)) recalculateJsonForAllSizes(pFileName);
	else console.warn('WARN '.yellow + '- ' + pFileName.magenta + ' Vous essayez de modifier autre chose que des PNG ou des JSON, le format JPG n\'est pas supporté');
}

/**
	Redimensionne une image dans toutes les tailles indiqués dans config.json
	@params pFile chemin absolu vers le png à modifier
*/
function resizeImageForAllSizes(pFile) {
	var file = pFile;
	//Pour chaque taille spécifiée dans le json
	for (resizeName in config.resizes) {
		var resizeValue = config.resizes[resizeName];
		//On redimensionne l'image et on l'enregistre dans un dossier au nom donné pour la taille
		resizeImage(file, resizeValue, resizeName);
	}
}

/**
	Redimensionne l'image passée en paramètre à la taille resizeValue et l'enregistre dans le dossier folderName
	@params file l'image à modifier
	@params resizeValue le ratio de taille voulu (par ex: pour une image 2 fois plus petite, 0.5)
	@params folderName, le nom du dossier parent de l'image modifiée
*/
function resizeImage(file, resizeValue, folderName) {
	//On 'ouvre' l'image
	lwip.open(file, function(error, image) {
		var paths = getUsefullPaths(file, folderName);
		console.log('Processing ' + file);
		//mkdir crée les dossiers si ils n'existent pas
        mkdirp(paths.dir , function(error) { 
			if(error) return console.error(error);
			
			//Calcul de la taille de l'image, une taille de 0px fait planter le script
			var widthComputed  = Math.floor(image.width()  * resizeValue);
			var heightComputed = Math.floor(image.height() * resizeValue);
			var imgWidth  = (widthComputed  >= 1) ? widthComputed  : 1;
			var imgHeight = (heightComputed >= 1) ? heightComputed : 1;

			//On fait des opérations sur l'image, batch() permet d'enchainer les instructions sur une image, comme jquery
			image.batch()
			.resize(imgWidth, imgHeight)
			.writeFile(paths.finalFileName, function(err) {
	            if (err) return console.log('Error on Image Write ' + err);
	            console.log('OK '.green + file + ' ' + folderName.cyan);
	        });
		});	
	});
}

/*
	Permet d'obtenir un tableau associatif de string facilement utilisable pour la lecture/écriture
	Pour un nom de fichier comme ça : C:\Users\Moi\dossier\dossier2\textureResize\to_convert\dossierA\image.png
	On obtient : 
	localDirPathWithoutFileName : \dossierA\
	dir : C:\Users\Moi\dossier\dossier2\textureResize\converted\hd\dossierA\
	finalFileName : C:\Users\Moi\dossier\dossier2\textureResize\converted\hd\dossierA\image.png
	
	@params pAbsoluteFileName le chemin absolu du fichier
	@params pRequiredSubFolder le nom du dossier dans lequel le fichier modifié sera placé
	@return un objet contenant {dir, finalFileName}
*/
function getUsefullPaths(pAbsoluteFileName, pRequiredSubFolder) {
	var localDirPathWithoutFileName = getLocalPath(pAbsoluteFileName).replace(getLocalPath(pAbsoluteFileName).split('\\').pop(), "");
	var dir = DESTINATION_FOLDER + pRequiredSubFolder + localDirPathWithoutFileName;
	var finalFileName = DESTINATION_FOLDER + pRequiredSubFolder + getLocalPath(pAbsoluteFileName);

	return {
		dir : dir,
		finalFileName : finalFileName
	}
}

/**
	Enlève le morceau du path qui mène au dossier à convertir script
	Retourne une string du style "\dossierA\image.png" quand on passe qqchose comme
	"C:\Users\Moi\dossier\dossier2\textureResize\to_convert\dossierA\image.png"
	@param pAbsoluteFileName le chemin absolu du fichier
*/
function getLocalPath(pAbsoluteFileName) {
	var subDirPath = pAbsoluteFileName;
	subDirPath = subDirPath.replace(IMAGES_FOLDER, "");
	return subDirPath;
}

/**
	Calcule les nouvelles valeurs du json pour chaque valeur spécifiée dans le tableau assoc resizes de config.json
	@params pFileName, le chemin absolu du fichier
*/
function recalculateJsonForAllSizes(pFileName) {
	for (resizeName in config.resizes) {
		var resizeValue = config.resizes[resizeName];
		recalculateJson(pFileName, resizeValue, resizeName);
	}
}

/*
	Change les valeurs du json en fonction de resizeValue et enregistre le json modifié dans le répertoire folderName
*/
function recalculateJson(pFileName, resizeValue, folderName) {

	//On ouvre le json
	fs.readFile(pFileName, 'utf-8', function(error, file) {
		var paths = getUsefullPaths(pFileName, folderName);
		var json = JSON.parse(file);

		if(!json.hasOwnProperty('frames')) return console.log('Ignored ' + pFileName.yellow);
		var jsonFrames = json.frames;

		//Le json contient des objets complexes contenant des nombres au lieu de tout faire à la main, on parcourt tout ce qu'il y a dedans
		for (itemName in jsonFrames) {
			var currentItem = jsonFrames[itemName];
			if(currentItem.hasOwnProperty('frame') && currentItem.hasOwnProperty('spriteSourceSize') && currentItem.hasOwnProperty('sourceSize')) {
				recalculateAllPropertiesOf(currentItem.frame, resizeValue);
				recalculateAllPropertiesOf(currentItem.spriteSourceSize, resizeValue);
				recalculateAllPropertiesOf(currentItem.sourceSize, resizeValue);
			}
		}
		
		mkdirp(paths.dir , function(error) { 
			if(error) console.error(error);
			else {
				fs.writeFile(paths.finalFileName, function(error) {
					if(error) console.log('Error on writing JSON : '.red + error);
					else console.log('OK '.green + pFileName + ' ' + folderName.cyan);
				});
			}
		});
	});
	
}

/**
	Parcourt toutes les propriétés d'un objet et les multiplie par la valeur passée en paramètre
*/
function recalculateAllPropertiesOf(pObject, pValue) {
	for(prop in pObject) {
		if(typeof(pObject[prop]) !== 'number') return console.log('WARN '.yellow + ' la propriété que vous tentez de modifier n\'est pas un nombre');
		pObject[prop] = Math.round(pObject[prop] * pValue);
	}
}