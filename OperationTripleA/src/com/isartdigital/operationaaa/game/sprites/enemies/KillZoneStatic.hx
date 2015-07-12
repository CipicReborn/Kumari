package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import pixi.display.DisplayObjectContainer;

/**
 * ...
 * @author Cedric RECOL
 */
class KillZoneStatic extends Hostile {
	
	public static var list:Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	public function new() {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super();
		assetName = 'KillZoneStatic';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	/**
	 * Paramètre l'objet avant de l'ajouter à la DisplayList (après sortie du Pool)
	 * @param	pId la référence LD de l'objet
	 * @author Cyprien
	 */
	 public function set (pId: String): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• list.push(this)
		//• lancer éventuellement le start ici
		id = pId;
		list.set(pId , this);
	}
	
	/**
	 * Déparamètre l'objet avant de le remettre dans le Pool (après retrait de la DisplayList)
	 * @param	pIdla référence LD de l'objet
	 * @author Cyprien
	 */
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		if (id == null) Debug.warn('[KillZoneStatic.unset] You are trying to remove an KillZoneStatic with no Id (already unset)');
		if (list.exists(id)) list.remove(id);
		if (list.exists(id)) Debug.warn('[KillZoneStatic.unset] Removal from list has failed for KillZoneStatic ' + id) ;
		id = null;
	}
	
	override function get_hitBox():DisplayObjectContainer {
		return cast box.getChildByName("mcGlobalBox");
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
}