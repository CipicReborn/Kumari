package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.utils.game.PoolManager;
import haxe.Timer;
import pixi.geom.Point;

/**
 * ...
 * @author Cedric RECOL
 */
class EnemyTurret extends Enemy {

	//immobile
	//tir sur la position du joueur
	//collisione uniquement avec le joueur
	
	private var WAIT:String = "wait";
	private var ACTIVE:String = "fire";
	private var DEATH:String = "death";
	
	public function new () {
		super();
		
		initialLifePoints = 4;
		
		assetName = 'EnemyTurret';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	override private function createShoot(?pScale:Float = 0):Void {
		var lPoint = GamePlane.getInstance().toLocal(box.toGlobal(onCrosshair()));
		var lRotation = Math.atan2((Player.getInstance().y - Player.getInstance().height / 3) - lPoint.y, Player.getInstance().x - lPoint.x);
		//trace(lRotation + "--------------------------------------------------------");
		
		var lShoot = cast(PoolManager.getInstance().getFromPool('ShootEnemyTurret'), Shoot);
		lShoot.set(3.5, 0.75, scale, lPoint, false, false, lRotation, true); // TODO passer ces valeurs de shoots en dur en attributs de l'enemy. (de Cipic)
		
		GamePlane.getInstance().addChild(lShoot); // TODO addChild dans le bon "sous-plan" de jeu ? (de Cipic)
		
		//trace(lShoot.rotation);
		setState(WAIT,true);
		doAction = doActionNormal;
	}

	
	override private function doActionNormal():Void {
		if (playerDetector()) {
			setModeShoot();
		}
	}
	
	private function setModeShoot():Void {
		setState(ACTIVE);
		doAction = doActionShoot;
	}
	
	private function doActionShoot():Void {
		countShoot++;
		
		if (countShoot >= 120) {
			createShoot();
			//trace ("shoot");
			countShoot = 0;
		}
		
		
	}
	
}