package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.collectables.Upgrade;
import com.isartdigital.utils.game.StateGraphic;

/**
 * ...
 * @author Cyprien LARROUY
 */
class UpgradeSetter extends GameObjectSetter{
	
	private var isActivated:Bool = false;
	
	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId:String) {
		super(pModel, pClass, pId);
		plane = GamePlane.getInstance().objectsContainer;
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		cast(inGameInstance, Upgrade).set(id.toString());
	}
	
	override public function unset():Void {
		if (id == null) trace ('WARNING: you are trying to remove a Checkpoint with no Id');
		if (!Upgrade.list.remove(id)) trace ('ERROR: removal of Checkpoint ' + id + ' has failed.') ;
		super.unset();
	}
}