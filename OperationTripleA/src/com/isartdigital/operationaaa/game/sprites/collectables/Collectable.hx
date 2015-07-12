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
	 * liste des collectables. On choisit une map plut�t qu'un Array pour l'identifiant fixe.
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
		//� Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs � des propri�t�s si elles 
		//  diff�rent entre chaque instance. 
		//� Faites un PoolManager.addToPool(assetName,this)
		//� Ne faites pas de list.push(this)
		
		super();
		assetName = 'Collectable';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	/**
	 * Param�tre l'objet avant de l'ajouter � la DisplayList (apr�s sortie du Pool)
	 * @param	pId la r�f�rence LD de l'objet
	 */
	 public function set (pId: String, pAlreadyCollected: Bool): Void {
		//� Toute valeur sp�cifique � une instance doit �tre pass�e � cette m�thode.
		//� Activer les �couteurs ici
		//� addChild l'instance
		//� list.push(this)
		//� lancer �ventuellement le start ici
		id = pId;
		
		collected = false; // dans cette partie
		alreadyCollected = pAlreadyCollected; // dans la sauvegarde
		if (alreadyCollected) setModeGhost();
		
		list.set(pId , this);
	}
	
	/**
	 * D�param�tre l'objet avant de le remettre dans le Pool (apr�s retrait de la DisplayList)
	 * @param	pIdla r�f�rence LD de l'objet
	 */
	public function unset (): Void {
		//� D�sactivez les �couteurs et tout ce qui poursuivrait son ex�cution
		//� Passez en setModeVoid
		//� Retirez de list
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
		//� quand vous avez besoin de d�finitivement d�truire une instance
		//� appeler la m�thode d�sactivation dans le destroy en plus du code sp�cifique au 
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
	 * retourne un tableau de points de collision dont les coordonn�es sont exprim�es dans le systeme global
	 * TODO: pourquoi ne pas utiliser hitPoints ? (de Cipic)
	 */
	public var hitPoint (get, null): Point;
	
	function get_hitPoint(): Point {
		return box.getChildByName("mcCenter").position;
	}
	
	
}