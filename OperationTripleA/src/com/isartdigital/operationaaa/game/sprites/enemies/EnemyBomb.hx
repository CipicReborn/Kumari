package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.planes.GamePlane;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.operationaaa.game.sprites.walls.Destructible;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.PoolManager;
import haxe.Timer;
import pixi.display.DisplayObject;
import pixi.geom.Point;

/**
 * ...
 * @author Cedric RECOL
 */
class EnemyBomb extends Enemy {

	//renvoi des tirs simples
	public var alive:Bool = true;
	
	public function new () {
		
		super();
		
		maxHSpeed = 5;
		maxSteps = 150;
		initialLifePoints = 3;
		
		assetName = 'EnemyBomb';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	override function setModeNormal (): Void {
		super.setModeNormal();
		anim.scale.x *= -1;
	}
	
	private function checkExplosionDetector():DisplayObject {
		return box.getChildByName("mcExplosionDetector");
	}
	
	override private function doActionPatrol():Void {
		if (CollisionManager.hitTestObject(Player.getInstance().hitBox,checkExplosionDetector())) setModeExplosion();
		super.doActionPatrol();
	}
	
	private function setModeExplosion():Void {
		//setState("explosion");
		trace("explosion");
		Timer.delay(explosion, 2500);
		doAction = doActionVoid;
	}
	
	private function explosion():Void {
		if (CollisionManager.hitTestObject(Player.getInstance().hitBox, checkExplosionDetector())&& alive) {
			Player.getInstance().kill();
		}
		for (lWall in Wall.list) {
			var lDest = Std.instance(lWall, Destructible);
			if (lDest != null && CollisionManager.hitTestObject(lDest.hitBox, checkExplosionDetector())) {
				LevelManager.getInstance().removeFromLevel(lDest);
			}
		}
		setModeDeath();
		//LevelManager.getInstance().removeFromLevel(this);
	}
	
	override public function hurt(pDamage, ?shootScaleX:Float = 0):Void 
	{
		//trace(shootScaleX + "shootscalex");
		if (pDamage == 3) {
			lifePoints -= pDamage;
		}else {
			createShoot(shootScaleX);
		}
		
		if (lifePoints <= 0) {
			
			alive = false;
		}
	}
	override private function createShoot(?pScale:Float = 0):Void {
		//trace(pScale);
		var lScale:Point = scale;
		lScale.x = (pScale == 0)? scale.x : pScale*= -1;
		
		var lPoint = GamePlane.getInstance().toLocal(box.toGlobal(onCrosshair()));
		
		var lShoot = cast(PoolManager.getInstance().getFromPool('ShootEnemyFire'), Shoot);
		lShoot.set(10, 0.67, lScale, lPoint, false); // TODO passer ces valeurs de shoots en dur en attributs de l'enemy. (de Cipic)
		
		GamePlane.getInstance().addChild(lShoot); // TODO addChild dans le bon "sous-plan" de jeu ? (de Cipic)
	}
}