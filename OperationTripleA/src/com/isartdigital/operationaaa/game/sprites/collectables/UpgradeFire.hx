package com.isartdigital.operationaaa.game.sprites.collectables;
import com.isartdigital.utils.game.PoolManager;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class UpgradeFire extends Upgrade {

	public function new() {
		super();
		PoolManager.getInstance().addToPool('UpgradeFire', this);
	}
	
	override function setModeNormal():Void {
		super.setModeNormal();
		setState(DEFAULT_STATE);
		anim.gotoAndStop(0);
	}
	
}