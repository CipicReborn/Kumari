package com.isartdigital.operationaaa;
import com.isartdigital.utils.Config;
import haxe.Serializer;
import haxe.Unserializer;
import js.Browser;
import js.Cookie;
import js.html.DOMWindow;

	
/**
 * ...
 * @author Cyprien LARROUY & Benjamin PAGEAUD
 */
class SaveManager {
	
	
	// =======================##### VARIABLES ET FONCTIONS STATIQUES #####=======================
	
	static inline var LEVELS_DATA:		String = "levels_data";
	static inline var LEVEL_SORTING:	String = "level_sorting";
	static inline var USER_CONFIG:		String = "user_config";
	
	/**
	 * Label auquel chercher la version dans l'objet de données
	 */
	static inline var VERSION_LABEL:	String = 'dataModelVersion';
	
	/**
	 * Numéro de version. A changer à chaque évolution du modèle de données.
	 * ATTENTION : un changement de version supprime la sauvegarde chez TOUS les utilisateurs
	 */
	static inline var VERSION_ID:		String = 'alpha_1.0';

	/**
	 * instance unique de la classe SaveManager
	 */
	private static var instance: SaveManager;
	
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): SaveManager {
		
		if (instance == null) instance = new SaveManager();
		return instance;
	}
	
	
	
	// =======================##### VARIABLES #####=======================
	
	/**
	 * l'Objet de données qui sera sauvegardé sous forme de Cookie. C'est un assemblage des variables déclarées ensuite.
	 */
	private var data: Map<String, Dynamic>;
	
	/**
	 * Raccourci vers l'ordre d'affichage des levels dans l'Objet Data
	 */
	public var levelSorting (get, set): Array<Int>;
	
	/**
	 * Raccourci vers les données des level dans l'Objet Data
	 */
	public var levelsData (get, set): Array<Map<String, Dynamic>>;
	
	/**
	 * Raccourci vers les données de config perso de l'utilisateur
	 */
	public var userConfig(get, set):Map<String, Dynamic>;
	

	
	// =======================##### FONCTIONS #####======================= SaveManager.getInstance().playerHasShield, playerHasSuperShoot à coder
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() {
		
		//on récupère les données sauvegardées.
		data = getData();
		
		// si pas de sauvegarde, on appelle initialiseDataObject qui crée un objet Data Vide.
		if (data == null) {
			
			initialiseDataObject();
			save();
		} else {
			
			//trace(data);
		}
	}
	
	
	private function initialiseDataObject (): Void {
		
		data = new Map<String, Dynamic>();
		initLevelSorting();	// l'ordre d'apparition des niveaux dans l'écran de sélection des niveaux
		initLevelsData();	// les données de jeu
		initUserConfig();	// les options de langue et de son du joueur
		data.set(VERSION_LABEL, VERSION_ID);
		trace(data);
	}
	
	
	private function initLevelSorting (): Void {
		
		data[LEVEL_SORTING] = new Array<Int>();
	}
	
	
	public function initLevelsData (): Void {
		
		data[LEVELS_DATA] = new Array<Map<String, Dynamic>>();
		
		for (i in 1...5) {
			data[LEVELS_DATA][i] = new Map<String, Dynamic>();
		}
		
		trace("[SaveManager.initialiseDataObject] Levels Data length : " + data[LEVELS_DATA].length);
	}
	
	
	/**
	 * @author Benjamin
	 * Initialisation de la partie paramètres de config de l'utilisateur
	 */
	public function initUserConfig():Void {
		var lUserConfig:Map<String, Dynamic> = new Map<String, Dynamic>();
		data[USER_CONFIG] = lUserConfig; 
			
		lUserConfig["language"] = Config.language;
		//N'a aucun effet sur le code actuellement
		lUserConfig["sound_muted"] = false;
	}
	
	
	public function save() {
		
		Cookie.set("OperationAAASavedGame", Serializer.run(data), 60 * 60 * 24 * 365, "com.isartdigital.operationaaa");
		//trace('[SaveManager.save] Data to Save : ' + data);
		//trace('[SaveManager.save] Data Serialized : ' + Serializer.run(data));
		//trace('## DATA SAVED TO COOKIE ##');
	}
	
	/**
	 * Retourne un objet de données désérialisé ou null si le cookie n'est pas défini
	 * @return 
	 */
	public function getData(): Map<String, Dynamic> {
		
		var lCoookieData: String = Cookie.get("OperationAAASavedGame");
		//trace('[SaveManager.getData] Cookie data : ' + lCoookieData);
		
		if (lCoookieData != null) {
			
			var lData: Map<String, Dynamic> = Unserializer.run(Cookie.get("OperationAAASavedGame"));
			//trace('[SaveManager.getData] Unserialized Data : ' + lData);
			
			if (lData.get(VERSION_LABEL) != VERSION_ID) {
				Browser.window.alert('ATTENTION : Votre sauvegarde a été effectuée avec un modèle obsolète.\n\nVotre sauvegarde va être effacée.');
				lData = null;
			}
			return lData;
			
		} else {
			
			return null;
		}
	}
	
	
	public function getLevelData (pLevel: Int): Map<String, Dynamic> {
		
		trace(data[LEVELS_DATA][pLevel]);
		if (data == null || data[LEVELS_DATA][pLevel].length == 0) { return null; };
		
		return data[LEVELS_DATA][pLevel];
	}
	
	public function saveLevelData (pLevel: Int, pData: Map<String, Dynamic>): Void {
		
		data[LEVELS_DATA][pLevel] = pData;
		save();
	}
	
	public function deleteSave() {
		
		initialiseDataObject();
		Cookie.remove("OperationAAASavedGame", "com.isartdigital.operationaaa");
	}
	
	
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}
	
	
	
	// ==== #### GETTERS & SETTERS #### ====
	
	private function get_levelSorting (): Array<Int> {
		
		if (data == null || data[LEVEL_SORTING].length == 0) { return null; };
		
		return data[LEVEL_SORTING];
	}
	
	private function  set_levelSorting (pArray: Array<Int>): Array<Int> {
		data[LEVEL_SORTING] = pArray;
		trace(pArray);
		save();
		return data[LEVEL_SORTING];
	}
	
	private function get_levelsData (): Array<Map<String, Dynamic>> {
		
		if (data == null || data[LEVELS_DATA].length == 0) { return null; };
		
		return data[LEVELS_DATA];
	}
	
	private function set_levelsData (pArray: Array<Map<String, Dynamic>>): Array<Map<String, Dynamic>> {
		
		data[LEVELS_DATA] = pArray;
		save();
		return data[LEVELS_DATA];
	}
	
	private function get_userConfig():Map<String, Dynamic> {
		
		if (data == null || data[USER_CONFIG] == null) return null;
		return data[USER_CONFIG];
	}
	
	private function set_userConfig(pMap:Map<String,Dynamic>):Map<String,Dynamic> {
		
		data[USER_CONFIG] = pMap;
		return data[USER_CONFIG];
	}
}