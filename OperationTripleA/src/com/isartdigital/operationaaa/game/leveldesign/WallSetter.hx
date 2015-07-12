package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;

/**
 * ...
 * @author Cyprien LARROUY
 */
class WallSetter extends GameObjectSetter{

	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId:String) {
		super(pModel, pClass, pId);
		plane = type.indexOf("Ground") == -1 ? GamePlane.getInstance().wallsContainer : GamePlane.getInstance().groundsContainer;
		
	}
	
	override public function specificSetup (): Void {
		cast(inGameInstance, Wall).set(id.toString());
	}
	
	override public function unset():Void {
		cast(inGameInstance, Wall).unset();
		super.unset();
	}
}