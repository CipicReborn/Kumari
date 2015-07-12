package com.isartdigital.operationaaa.game.sprites.platforms;
import com.isartdigital.operationaaa.game.sprites.Collisionnable;
import com.isartdigital.utils.Debug;
import com.isartdigital.utils.game.PoolManager;
import com.isartdigital.utils.game.StateGraphic;
import pixi.display.DisplayObjectContainer;
import pixi.geom.Point;

/**
 * Classe de base pour les plateformes
 * @author Benjamin
 */
class Platform extends Collisionnable {
	
	//Contient la liste de toutes les platforms en jeu
	public static var list:Map<String, StateGraphic> = new Map<String, StateGraphic>();
	
	public function new (pAssetName: String) {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super();
		assetName = pAssetName;
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	/**
	 * Paramètre l'objet avant de l'ajouter à la DisplayList (après sortie du Pool)
	 * @param	pId la référence LD de l'objet
	 * @author	Cyprien
	 */
	 public function set (pId: String): Void {
		//• Toute valeur spécifique à une instance doit être passée à cette méthode.
		//• Activer les écouteurs ici
		//• addChild l'instance
		//• list.push(this)
		//• lancer éventuellement le start ici
		id = pId;
		list.set(pId , this);
	}
	
	/**
	 * Déparamètre l'objet avant de le remettre dans le Pool (après retrait de la DisplayList)
	 * @param	pIdla référence LD de l'objet
	 * @author	Cyprien
	 */
	public function unset (): Void {
		//• Désactivez les écouteurs et tout ce qui poursuivrait son exécution
		//• Passez en setModeVoid
		//• Retirez de list
		setModeVoid();
		if (id == null) Debug.warn('[Platform.unset] You are trying to unset a Platform with no id');
		if (list.exists(id)) list.remove(id);
		if (list.exists(id)) Debug.warn('[Platform.unset] Removal from list has failed for Platform ' + id) ;
		id = null;
	}
	
	
	override function get_hitBox (): DisplayObjectContainer {
		return cast box.getChildByName("mcGlobalBox");
	}
	
	override public function destroy (): Void {
		//• quand vous avez besoin de définitivement détruire une instance
		//• appeler la méthode désactivation dans le destroy en plus du code spécifique au 
		//destroy
		unset();
		super.destroy();
	}
}