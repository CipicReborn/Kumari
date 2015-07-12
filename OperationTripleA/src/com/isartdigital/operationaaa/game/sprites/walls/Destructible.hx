package com.isartdigital.operationaaa.game.sprites.walls;
import com.isartdigital.operationaaa.game.leveldesign.LevelManager;
import com.isartdigital.operationaaa.game.sprites.Collisionnable;
import com.isartdigital.operationaaa.game.sprites.shoot.Shoot;
import com.isartdigital.utils.game.CollisionManager;
import com.isartdigital.utils.game.PoolManager;
import pixi.display.DisplayObjectContainer;

/**
 * ...
 * @author Cindy Asselin de Beauville
 */
class Destructible extends Wall {

	public function new () {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super("Destructible");
	}
	
	override public function doActionNormal (): Void {
		for (shoot in Shoot.list[0]) {
			if (shoot.isASuperShoot) {
				if (CollisionManager.hitTestObject(this, shoot)) {
					LevelManager.getInstance().removeFromLevel(this);
				}
			}
		}
	}
}