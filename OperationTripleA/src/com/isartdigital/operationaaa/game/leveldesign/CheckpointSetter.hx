package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.Checkpoint;

/**
 * ...
 * @author Cyprien LARROUY
 */
class CheckpointSetter extends GameObjectSetter{
	
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
		cast(inGameInstance, Checkpoint).set(id.toString(), isActivated);
	}
	
	override public function unset():Void {
		var lCheckpoint: Checkpoint = cast(inGameInstance, Checkpoint);
		isActivated = lCheckpoint.isActivated;
		lCheckpoint.unset();
		super.unset();
	}
}