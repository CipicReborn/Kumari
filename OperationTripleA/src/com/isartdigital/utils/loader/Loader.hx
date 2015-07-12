package com.isartdigital.utils.loader;

import com.isartdigital.utils.events.LoaderEvent;
import com.isartdigital.utils.sounds.SoundManager;
import haxe.Json;
import howler.Howl;
import pixi.loaders.AssetLoader;
import pixi.loaders.JsonLoader;
import pixi.utils.Event;
import pixi.utils.EventTarget;

typedef SoundDescription = {
	name:String,
	options:HowlOptions
}

/**
 * Classe de chargement
 * Cette classe permet de gérer des chargements par lot aussi bien de fichiers textes que de ressources graphiques ou du son
 * @author Mathieu ANTHOINE
 */
class Loader extends EventTarget {
	
	/**
	 * liste des fichiers chargés
	 */
	private static var txtLoaded:Map<String,Dynamic> = new Map<String,Dynamic>();
	
	/**
	 * liste des fichiers texte à charger
	 */
	private var txtFiles:Array<String>;
	
	/**
	 * liste des fichiers graphiques à charger
	 */
	private var assetsFiles:Array<String>;	

	/**
	 * liste des fichiers sons à charger
	 */
	private var soundsList:Array<String>;		
	
	/**
	 * liste des fichiers sons à charger
	 */
	private var soundsFiles:Array<SoundDescription>;	
	
	/**
	 * indice de chargement courant
	 */
	private var loaded : Int;
	
	/**
	 * nombre de fichier à charger (initialisé à chaque chargement)
	 */
	private var nbFiles : Int;
	
	/**
	* retourne le contenu chargé pour le chemin de fichier passé en paramètre
	* @param	pFile chemin du fichier
	* @return	contenu du fichier pour un URLLoader, référence d'objet pour un Loader ou undefined si le contenu n'est pas chargé
	*/
	public static function getContent (pFile:String, ?pPath:String = null):Dynamic {
		if (pPath == null) pPath = Config.assetsPath;
		return txtLoaded[pPath+pFile];
	}
	
	public function new () {
		
		super();
		
		trace ("========== Loader: Initialisation ==========");
		
		txtFiles = [];
		assetsFiles = [];
		soundsList = [];
		soundsFiles = [];
		
	}	
	
	/**
	* ajoute un fichier de type texte à la liste de chargement (actuellement seuls les JSon sont supportés)
	* @param	pUrl chaine de caractères spécifiant le chemin vers le fichier
	*/
	public function addTxtFile (pUrl:String, ?pPath:String = null):Void {
		if (pPath == null) pPath = Config.jsonPath;
		trace("Loader: addTxtFile = "+pPath+pUrl);
		txtFiles.push(pPath+pUrl);		
		
	}
	
	/**
	* ajoute un fichier d'assets à la liste de chargement
	* @param	pUrl chaine de caractère spécifiant le nom du fichier
	*/
	public function addAssetFile (pUrl:String):Void {
		
		trace("Loader: addAssetFile = "+Config.assetsPath+pUrl);	
		assetsFiles.unshift(Config.assetsPath+pUrl);
		
	}
	
	/**
	* ajoute une liste de sons à la liste de chargement
	* @param	pUrl chaine de caractère spécifiant le nom du fichier
	*/
	public function addSoundFile (pUrl:String):Void {
		
		trace("Loader: addSoundFile = "+Config.soundsPath+pUrl);	
		soundsList.push(Config.soundsPath+pUrl);
		
	}
			
	/**
	* lance le chargement du contenu
	*/
	public function load ():Void {
		
		trace ("---------- Loader: Chargement ----------");
		
		loaded = 0;
		loadSoundsLists();
	}
	
	/**
	 * charge les fichiers liste de sons
	 */
	private function loadSoundsLists():Void {
		if (soundsList.length > 0) {
			var lLoader:JsonLoader = new JsonLoader(soundsList.shift());			
			lLoader.addEventListener("loaded", onSoundsListsLoaded);
			lLoader.load();
		} else {
			nbFiles = txtFiles.length + assetsFiles.length + soundsFiles.length;
			loadNext();
		} 
	}

	/**
	 * analyse les fichiers liste de son et construit la liste des sons et stocke leurs paramètres
	 * @param	pEvent
	 */
	private function onSoundsListsLoaded(pEvent:Event) : Void {
		
		trace ("Loader: "+ pEvent.target.url + " chargé");
		
		pEvent.target.removeEventListener("loaded", onSoundsListsLoaded);
		
		var lList:Json = cast(pEvent.target, JsonLoader).json;
		
		addSounds(Reflect.field(lList, SoundManager.FX),false,Reflect.field(lList, "extensions"));
		addSounds(Reflect.field(lList, SoundManager.MUSIC),true,Reflect.field(lList, "extensions"));
		
		loadSoundsLists();
	}
	
	private function addSounds (pList:Dynamic, pLoop:Bool,pExtensions:Array<String>): Void {		
		for (lID in Reflect.fields(pList)) soundsFiles.push( {name:lID,options:{ urls:[for (i in 0...pExtensions.length) Config.soundsPath+lID+"."+pExtensions[i]], volume:Reflect.field(pList,lID)/100, loop:pLoop,onload:onSoundLoaded }} );
	}
		
	/**
	* Charge le fichier suivant
	*/
	private function loadNext ():Void {	
		
		if (txtFiles.length > 0) {
			var lLoader:JsonLoader = new JsonLoader(txtFiles.shift());			
			lLoader.addEventListener("loaded", onTxtLoaded);
			lLoader.load();
		} else if (assetsFiles!=null) {
			var lLoader:AssetLoader = new AssetLoader(assetsFiles);
			lLoader.addEventListener("onProgress", onAssetLoaded);
			lLoader.load();
		} else if (soundsFiles.length > 0) {
			SoundManager.addSound(soundsFiles[0].name,new Howl( soundsFiles[0].options ));
		} else onComplete();
		
	}	
	
	/**
	 * executé sur chargement d'un fichier texte
	 * @param	pEvent
	 */
	private function onTxtLoaded(pEvent:Event) : Void {
		
		pEvent.target.removeEventListener("loaded", onTxtLoaded);
		txtLoaded[pEvent.target.url] = cast(pEvent.target, JsonLoader).json;
		
		currentLoadComplete();
		
		trace ("Loader: "+ pEvent.target.url + " chargé ("+loaded+"/"+nbFiles+")");
		
		loadNext();

	}
	
	/**
	 * executé sur chargement des assets graphiques
	 * @param	pEvent
	 */
	private function onAssetLoaded(pEvent:Event) : Void {
		
		if (Std.is(pEvent.content.loader, JsonLoader)) txtLoaded[pEvent.content.loader.url]=cast(pEvent.content.loader, JsonLoader).json;
		currentLoadComplete();
		
		trace ("Loader: "+ pEvent.target.assetURLs[pEvent.target.loadCount] + " chargé ("+loaded+"/"+nbFiles+")");
		
		if (pEvent.target.loadCount == 0) {
			pEvent.target.removeEventListener("onProgress", onAssetLoaded);
			assetsFiles =null;
			loadNext();
		}
		
	}
	
	/**
	 * executé sur chargement des fichiers sons
	 */
	private function onSoundLoaded() : Void {
		currentLoadComplete();

		trace ("Loader: Son "+ soundsFiles[0].name + " chargé ("+loaded+"/"+nbFiles+")");
		soundsFiles.shift();
		loadNext();
	}

	/**
	* propage l'évenement diffusé par les loaders
	* @param	pEvent
	*/
	private function currentLoadComplete ():Void {		
		loaded++;
		dispatchEvent(LoaderEvent.PROGRESS, { loaded:loaded,total:nbFiles} );
	}
	
	/**
	 * diffuse l'évenement de fin de chargement
	 */
	private function onComplete ():Void {
		trace ("---------- Loader: Fin ----------");
		dispatchEvent(LoaderEvent.COMPLETE);
	}
}