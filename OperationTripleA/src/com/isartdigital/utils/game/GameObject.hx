package com.isartdigital.utils.game;
import pixi.display.DisplayObjectContainer;

/**
 * Classe de base des objets interactifs dans le jeu
 * expose de façon publique sa méthode doAction qui peut faire référence à différentes méthodes prévues (doActionVoid, doActionNormal) ou spécifiques définies par ses classes filles
 * Par convention le changement de référence de doAction se fait via des méthodes setMode (setModeVoid, setModeAction) qui peuvent aussi contenir des paramètres d'initialisation
 * @author Mathieu ANTHOINE
 */
class GameObject extends DisplayObjectContainer 
{
	
	/**
	 * méthode appelée à chaque gameLoop. Elle peut faire référence à différentes méthodes au cours du temps
	 */
	public var doAction:Dynamic;
	
	/**
	 * nom d'instance
	 */
	public var id: String;
	
	public function new () {
		super();
		setModeVoid();
	}
	
	/**
	 * applique le mode "ne fait rien"
	 */
	public function setModeVoid (): Void {
		doAction = doActionVoid;
	}
	
	/**
	 * fonction vide destinée à maintenir la référence de doAction sans rien faire
	 */
	private function doActionVoid (): Void {}

	
	/**
	 * applique le mode normal (mode par defaut)
	 */
	private function setModeNormal(): Void {
		doAction = doActionNormal;
	}
	
	/**
	 * fonction destinée à appliquer un comportement par defaut
	 */
	private function doActionNormal (): Void {}
	
	/**
	 * Activation
	 */
	public function start (): Void {
		setModeNormal();
	}
	
	/**
	 * nettoie et détruit l'instance
	 */
	public function destroy (): Void {
		setModeVoid();
	}

	
}