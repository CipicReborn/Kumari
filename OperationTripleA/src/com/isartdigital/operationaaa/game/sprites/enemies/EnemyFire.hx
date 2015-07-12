package com.isartdigital.operationaaa.game.sprites.enemies;
import com.isartdigital.utils.game.PoolManager;

/**
 * ...
 * @author Cedric RECOL
 */
class EnemyFire extends Enemy {
	//si collision pas satisfaisante augmenter taille des canes :)

	public function new () {
		//• Aucun code activant l'instance (start, addChild ...) ou affectant des valeurs à des propriétés si elles 
		//  diffèrent entre chaque instance. 
		//• Faites un PoolManager.addToPool(assetName,this)
		//• Ne faites pas de list.push(this)
		
		super();
		
		maxHSpeed = 8;
		frictionGround = 1;
		accelerationGround = 0.75;
		maxSteps = 150;
		initialLifePoints = 6;
		
		assetName = 'EnemyFire';
		PoolManager.getInstance().addToPool(assetName, this);
	}
	
	override private function setModeNormal (): Void {
		setState(PATROL,true);
		doAction = doActionPatrol;
	}
	
	override private function doActionPatrol (): Void {
		
		if (playerDetector()) setModeFirePatrol();
		super.doActionPatrol();
	}
	
	private function setModeFirePatrol (): Void {
		//setState(FIREPATROL);
		doAction = doActionFirePatrol;
		
		//Timer.delay(untyped createShoot, 1200);
	}
	
	private function doActionFirePatrol (): Void {
		countShoot++;
		//si le joueur n'est plus dans la zone de detection on arrete l'ordre de tir
		if (!playerDetector()) {
			setModePatrol();
		}
		if (countShoot >= 75) {
			createShoot();
			countShoot = 0;
		}
		
		super.doActionPatrol();
	}
}