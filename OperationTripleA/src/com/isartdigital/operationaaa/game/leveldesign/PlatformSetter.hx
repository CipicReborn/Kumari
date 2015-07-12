package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;

/**
 * ...
 * @author Cyprien LARROUY
 */
class PlatformSetter extends GameObjectSetter{

	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId:String) {
		super(pModel, pClass, pId);
		plane = GamePlane.getInstance().platformsContainer;
		
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		
		cast(inGameInstance, Platform).set(id.toString());
	}
	
	override public function unset():Void {
		if (id == null) trace ('WARNING: you are trying to remove a Platform with no Id');
		if (!Platform.list.remove(id)) trace ('ERROR: removal of Platform ' + id + ' has failed.') ;
		super.unset();
	}
}