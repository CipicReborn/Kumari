package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneDynamic;
import com.isartdigital.utils.game.GameObject;

/**
 * ...
 * @author Cyprien LARROUY
 */
class KillZoneDynamicSetter extends GameObjectSetter {
	
	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId:String) {
		super(pModel, pClass, pId);
		rotation = Math.round(rotation * GameManager.DEG2RAD * 10) / 10;
		plane = GamePlane.getInstance().objectsContainer;
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		
		var lKZ: KillZoneDynamic = cast(inGameInstance,  KillZoneDynamic);
		lKZ.set(id.toString(), x, y, rotation);
	}
	
	override public function unset():Void {
		cast(inGameInstance,  KillZoneDynamic).unset();
		//if (!KillZoneDynamic.list.remove(id)) trace ('ERROR: removal of KillZoneDynamic ' + id + ' has failed.') ;
		super.unset();
	}
}