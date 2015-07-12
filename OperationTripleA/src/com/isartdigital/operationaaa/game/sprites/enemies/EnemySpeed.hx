package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.operationaaa.game.sprites.platforms.Platform;
import com.isartdigital.operationaaa.game.sprites.walls.Wall;
import com.isartdigital.utils.game.PoolManager;

/**
 * ...
 * @author Cedric RECOL
 */
class EnemySpeed extends Enemy {
	//immobile
	//detecte joueur = activation de la patrouille
	//collision joueur = mort
	
	public function new () {
		super();
		maxSteps = 100;
		maxHSpeed = 12;
		frictionGround = 1;
		accelerationGround = 1;
		initialLifePoints = 3;
		assetName = 'EnemySpeed';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	override private function canContinue (): Bool {
		
		//test collision wall in front top
		var wallInFront = testPoint(Wall.list, getFrontCaneTop());
		
		//test collision wall under
		var walkableWall = testPoint(Wall.list, getFrontCaneBottom());
		var walkablePlatform = testPoint(Platform.list, getFrontCaneBottom());
		
		
		if (wallInFront == null && (walkableWall != null || walkablePlatform != null)) return true;
		
		return false;
	}
}