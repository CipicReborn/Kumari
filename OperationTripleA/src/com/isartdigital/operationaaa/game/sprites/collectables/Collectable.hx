package com.isartdigital.operationaaa.game.sprites.collectables;
import com.isartdigital.operationaaa.game.leveldesign.LevelLoader;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.sprites.Collisionnable;
import com.isartdigital.operationaaa.ui.hud.Hud;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.sounds.SoundManager;
import js.Lib;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;

/**
 * ...
 * @author Benjamin PAGEAUD
 * @author Cyprien LARROUY
 */
class Collectable extends Collisionnable {
	
	// =======================##### VARIABLES ET FONCTIONS STATIQUES #####=======================
	
	/**
	 * liste des collectables. On choisit une map plutôt qu'un Array pour l'identifiant fixe.
	 */
	static public var list: Map<String, StateGraphic> = new Map<String, StateGraphic>();
	static public var dyingList: Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	static public var COLLECTED: String = "pickup";
	static public var GHOST: String = "ghost";
	
	// =======================##### VARIABLES #####=======================
	
	private var idNumber: Int;
	public var alreadyCollected: Bool = false;
	public var collected: Bool = false;
	
	var count: Int;
	
	// =======================##### FONCTIONS #####=======================
	
	public function new() {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super();
		assetName = 'Collectable';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	/**
	 * Paramètre l'objet avant de l'ajouter à la DisplayList (après sortie du Pool)
	 * @param	pId la référence LD de l'objet
	 */
	 public function set (pId: String, pAlreadyCollected: Bool): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• addChild l'instance
		//• list.push(this)
		//• lancer éventuellement le start ici
		id = pId;
		
		collected = false; // dans cette partie
		alreadyCollected = pAlreadyCollected; // dans la sauvegarde
		if (alreadyCollected) setModeGhost();
		
		list.set(pId , this);
	}
	
	/**
	 * Déparamètre l'objet avant de le remettre dans le Pool (après retrait de la DisplayList)
	 * @param	pIdla référence LD de l'objet
	 */
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		if (id == null) Debug.warn('[Collectable.unset] You are trying to unset a Collectable with no id');
		if (list.exists(id)) list.remove(id);
		if (list.exists(id)) Debug.warn('[Collectable.unset] Removal from list has failed for Collectable ' + id);
		id = null;
	}
	
	public function onPickup():Void {
		//trace('=# pickUp');
		setModeCollected();
		LevelLoader.getInstance().recordCollectablePickUp(id);
		Hud.getInstance().collectibleCount++;
		SoundManager.getSound("pickup_collectable").play();
	}
	
	
	public function setModeGhost (): Void {
		
		setState(GHOST);
		doAction = doActionNormal;
	}
	
	private function setModeCollected (): Void {
		
		setState(COLLECTED);
		collected = true;
		doAction = doActionCollected;
		count = 0;
	}
	
	public function doActionCollected (): Void {
		
		if (count++ > 5) {
			count = 0;
			kill();
		}
		//trace(count);
	}
	
	public function kill (): Void {
		//trace('Collectable ' + id + ' to LevelManager : Remove Me Now !');
		LevelManager.getInstance().removeFromLevel(this);
	}
	
	/**
	 * - unset
	 * - appelle super.destroy()
	 */
	override public function destroy (): Void {
		//• quand vous avez besoin de définitivement détruire une instance
		//• appeler la méthode désactivation dans le destroy en plus du code spécifique au 
		//destroy
		unset();
		super.destroy();
	}	
	
	
	// =======================##### GETTERS & SETTERS #####=======================

	
	override function get_hitBox():DisplayObjectContainer {
		if (collected) return null;
		else return cast box.getChildByName("mcGlobalBox");
	}
	
	/**
	 * retourne un tableau de points de collision dont les coordonnées sont exprimées dans le systeme global
	 * TODO: pourquoi ne pas utiliser hitPoints ? (de Cipic)
	 */
	public var hitPoint (get, null): Point;
	
	function get_hitPoint(): Point {
		return box.getChildByName("mcCenter").position;
	}
	
	
}