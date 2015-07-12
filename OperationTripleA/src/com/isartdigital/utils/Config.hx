package com.isartdigital.utils ;
import haxe.Json;
import js.Browser;

	
/**
 * Classe utilitaire contenant les données de configuration du jeu
 * @author Mathieu ANTHOINE
 */
class Config 
{
		
	/**
	 * version de l'application
	 */
	public static var version (get,never):String;
	
	/**
	 * langue courante
	 */
	public static var language (get,never): String;
	
	/**
	 * langues disponibles
	 */
	public static var languages (get,never): Array<String>;
	
	/**
	 * défini si le jeu est en mode "debug" ou pas (si prévu dans le code du jeu)
	 */
	public static var debug (get, never): Bool;
	
	/**
	 * défini si il faut afficher les fps ou non
	 */
	public static var fps (get,never): Bool;

	/**
	 * défini si il faut afficher le qrcode ou non
	 */
	public static var qrcode (get, never): Bool;	
	
	/** 
	 * chemin du dossier de langues
	 */
	public static var langPath (get, never): String;
	
	
	/** 
	 * chemin du dossier de fichiers texte
	 */
	public static var jsonPath (get, never): String;
	
	
	/** 
	 * chemin du dossier de fichiers texte
	 */
	public static var cssPath (get, never): String;
	
	
	/** 
	 * chemin du dossier d'assets graphiques
	 */
	public static var assetsPath (get, never): String;
	
	
	/** 
	 * chemin du dossier de sons
	 */
	public static var soundsPath (get, never): String;
	
	/**
	 * conteneur des données de configuration
	 */
	public static var data (get, never):Dynamic;
	private static var _data:Dynamic={};
	
	public static function init(pConfig:Json): Void {		
		for (i in Reflect.fields(pConfig)) Reflect.setField(_data, i, Reflect.field(pConfig, i));
		
		
		if (_data.version == null) _data.version = "0.0.0";
		if (_data.language == null ||_data.language == "") _data.language = Browser.window.navigator.language.substr(0, 2);
		if (_data.languages == []) _data.languages.push(_data.language);
		if (_data.debug == null) _data.debug = false;
		if (_data.fps == null) _data.fps = false;
		if (_data.qrcode == null) _data.qrcode = false;

		if (_data.langPath == null) _data.langPath = "";
		if (_data.assetsPath == null) _data.assetsPath = "";
		if (_data.jsonPath == null) _data.jsonPath = "";
		if (_data.cssPath == null) _data.cssPath = "";
		if (_data.soundsPath == null) _data.soundsPath = "";
			
	}
	
	private static function get_data ():Dynamic {
		return _data;
	}
	
	private static function get_version ():String {
		return _data.version;
	}
	
	private static function get_language ():String {
		return data.language;
	}
	
	private static function get_languages ():Array<String> {
		return data.languages;
	}
	
	private static function get_debug ():Bool {
		return data.debug;
	}
	
	private static function get_fps ():Bool {
		return data.fps;
	}
	
	private static function get_qrcode ():Bool {
		return data.qrcode;
	}
	
	private static function get_langPath ():String {
		return _data.langPath;
	}
	
	private static function get_cssPath ():String {
		return _data.cssPath;
	}
	
	private static function get_jsonPath ():String {
		return _data.jsonPath;
	}
	
	private static function get_assetsPath ():String {
		return _data.assetsPath;
	}
	
	private static function get_soundsPath ():String {
		return _data.soundsPath;
	}

}