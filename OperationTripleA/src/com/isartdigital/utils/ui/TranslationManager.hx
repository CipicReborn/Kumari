package com.isartdigital.utils.ui;

	
/**
 * Manager des textes de traduction
 * @author Benjamin PAGEAUD
 */
class TranslationManager 
{
	
	/**
	 * instance unique de la classe TranslationManager
	 */
	private static var instance: TranslationManager;
	
	/**
	 * Contient les fichier de traduction
	 */
	static private var translationFiles:Map<String, Dynamic> = new Map<String, Dynamic>();
	
	static private var translations(default, null):Map<String, String> = new Map<String, String>();
	
	static private var currentLanguage:String;
	/**
	 * Retourne l'instance unique de la classe, et la crée si elle n'existait pas au préalable
	 * @return instance unique
	 */
	public static function getInstance (): TranslationManager {
		if (instance == null) instance = new TranslationManager();
		return instance;
	}
	
	/**
	 * constructeur privé pour éviter qu'une instance soit créée directement
	 */
	private function new() 
	{
		
	}
	
	/**
	 * Ajoute les traductions à la liste des traductions disponibles
	 * @param	pJson
	 */
	static public function addTranslations(pLang:String, pJson:Dynamic):Void {
		if (Config.languages.indexOf(pLang) == -1) {
			trace("[Translation Manager] Le language que vous essayez de charger n'est pas disponible, vérifier le fichier de config");
			return;
		}
		translationFiles[pLang] = pJson;
		trace("[Translation Manager] : Fichier pour la langue " + pLang + " chargé dans TranslationManager");
	}
	
	/**
	 * Permet de choisir la langue dont on veut les traductions
	 * @param	pLang Langue désirée
	 */
	public function setLanguage(pLang:String):Void {
		if (Config.languages.indexOf(pLang) == -1) {
			Debug.error("[Translation Manager | setLanguage] Le langage demandé n'est pas disponible");
			return;
		} else if (translationFiles[pLang] == null) {
			Debug.error("[Translation Manager | setLanguage] Les fichiers de traduction pour la langue : " + pLang + " ne sont pas chargés dans le TranslationManager");
		}
		currentLanguage = pLang;
		setTranslatedTexts(pLang);
		trace("Traduction : Passage à la langue " + pLang );
	}
	
	/**
	 * Change la variable translations en fonction du langage passé en paramètre
	 * @param	pLang La langue des textes à utiliser
	 */
	private function setTranslatedTexts(pLang:String):Void {
		var transUnits:Array<Dynamic> = Reflect.field(translationFiles[pLang], "transUnits");
		
		for (lTransUnit in transUnits) {
			translations[lTransUnit.id] = lTransUnit.target;
		}
	}
	
	/**
	 * Retourne la traduction correspondant au label passé en paramètre
	 * @param	pLabel
	 * @return
	 */
	static public function get(pLabel:String):String {
		if (translations[pLabel] == null) {
			Debug.warn("Le label " + pLabel + " n'est pas disponible dans la langue : " + currentLanguage);
			return "LABEL_ERROR";
		}
		return translations[pLabel];
	}
	/**
	 * détruit l'instance unique et met sa référence interne à null
	 */
	public function destroy (): Void {
		instance = null;
	}

}