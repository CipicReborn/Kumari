package com.isartdigital.operationaaa.game.leveldesign;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.enemies.Enemy;
import com.isartdigital.utils.game.GameObject;
import pixi.geom.Point;

/**
 * ...
 * @author Cyprien LARROUY
 */
class EnemySetter extends GameObjectSetter {
	
	var stepsCount:Int;
	var lifePoints:Int;
	var doActionNow:Dynamic;
	var speed:Point = new Point(0, 0);
	
	public function new(pModel:Dynamic, pClass:Class<Dynamic>, pId: String) {
		super(pModel, pClass, pId);
		plane = GamePlane.getInstance().objectsContainer;
	}
	
	/**
	 * Attention : au moment de l'éxécution du specificSetup, le setModeNormal est déjà passé.
	 * Si besoin le rappeller, ou un autre setMode
	 */
	override public function specificSetup (): Void {
		
		var lObject: Enemy = cast (inGameInstance, Enemy);
		
		cast (inGameInstance, Enemy).set(id.toString(), lObject.initialLifePoints);
		
		//// s'il n'est pas encore entré en jeu, il n'a pas de lifePoints, on le set avec les initialLifePoints de sa classe
		//if (lifePoints == null) {
			//cast (inGameInstance, Enemy).set(id.toString(), lObject.initialLifePoints);
		//}
		//// sinon, c'est qu'il a déjà ses PV, et dans ce cas on lui redonne
		//else {
			//cast (inGameInstance, Enemy).set(id.toString(), lifePoints);
		//}
	}
	
	override public function unset():Void {
		var lObject: Enemy = cast (inGameInstance, Enemy);
		lifePoints = lObject.lifePoints;
		lObject.unset();
		super.unset();
	}
}