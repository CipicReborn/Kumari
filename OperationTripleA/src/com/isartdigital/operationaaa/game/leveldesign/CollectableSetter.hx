package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.collectables.Collectable;
import com.isartdigital.utils.game.GameObject;

/**
 * ...
 * @author Cyprien LARROUY
 */
class CollectableSetter extends GameObjectSetter{
	
	/**
	 * statut (true si déjà collecté par le joueur dans une partie précédente ou la partie en cours, false si jamais collecté).
	 */
	public var alreadyCollected (get, set): Bool;
	
	/**
	 * variable sous-jacente de collected (statut 'déjà ramassé ou pas' de chaque collectable)
	 */
	private var _alreadyCollected: Bool = false;
	
	/**
	 * pour la partie en cours
	 */
	private var collected: Bool;
	
	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId: String) {
		
		super(pModel, pClass, pId);
		plane = GamePlane.getInstance().objectsContainer;
		alreadyCollected = false;
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		cast(inGameInstance, Collectable).set(id.toString(), alreadyCollected);
	}
	
	/**
	 * Enlève de la liste des Collectables et appelle le super (setModeVoid et rupture du lien avec le setter)
	 */
	override public function unset():Void {
		var lCollectable: Collectable = cast(inGameInstance, Collectable);
		
		collected = lCollectable.collected;
		lCollectable.unset();
		super.unset();
	}
	
	private function get_alreadyCollected (): Bool {
		return _alreadyCollected;
	}
	
	private function set_alreadyCollected (pValue: Bool): Bool {
		_alreadyCollected = pValue;
		return _alreadyCollected;
	}
	
	
}