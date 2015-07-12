package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.enemies.KillZoneStatic;
import com.isartdigital.utils.game.GameObject;

/**
 * ...
 * @author Cyprien LARROUY
 */
class KillZoneStaticSetter extends GameObjectSetter {
	
	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId:String) {
		super(pModel, pClass, pId);
		plane = GamePlane.getInstance().objectsContainer;
		
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		
		var lKZ: KillZoneStatic = cast(inGameInstance,  KillZoneStatic);
		lKZ.stepsCount = 0;
		lKZ.set(id.toString());
	}
	
	override public function unset():Void {
		
		cast(inGameInstance,  KillZoneStatic).unset();
		//if (!KillZoneDynamic.list.remove(id)) trace ('ERROR: removal of KillZoneDynamic ' + id + ' has failed.') ;
		super.unset();
	}
}