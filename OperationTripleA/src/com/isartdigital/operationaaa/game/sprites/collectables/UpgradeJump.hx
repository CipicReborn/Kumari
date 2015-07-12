package com.isartdigital.operationaaa.game.sprites.collectables;
import com.isartdigital.utils.game.PoolManager;

/**
 * ...
 * @author 
 */
class UpgradeJump extends Upgrade {

	public function new() {
		super();
		PoolManager.getInstance().addToPool('UpgradeJump', this);
	}
	
	override function setModeNormal():Void {
		super.setModeNormal();
		setState(DEFAULT_STATE, false, false, 2);
	}
	
}