package com.isartdigital.utils.sounds;

import howler.Howl;
import howler.Howler;

	
/**
 * Manager centralisé de Sons Howler
 * @author Mathieu ANTHOINE
 */
class SoundManager
{
	/**
	 * liste de tous les sons du jeu
	 */
	private static var list (default,null):Map<String,Howl>;
	
	public static inline var FX:String = "fxs";
	public static inline var MUSIC:String = "musics";
	public static var soundsMuted:Bool;
	
	private function new() {
	}
	
	/**
	 * ajoute un son à la liste
	 * @param	pName identifiant du son
	 * @param	pSound son
	 */
	public static function addSound (pName:String,pSound:Howl):Void {
		if (list == null) list = new Map<String,Howl>();
		list[pName] = pSound;
	}
	
	/**
	 * retourne une référence vers le son par l'intermédiaire de son identifiant
	 * @param	pName identifiant du son
	 * @return le son
	 */
	public static function getSound(pName:String): Howl {
		if (list == null) list = new Map<String,Howl>();
		if (!list.exists(pName)) {
			return new Howl({ });
		}
		return list[pName];
	}
}