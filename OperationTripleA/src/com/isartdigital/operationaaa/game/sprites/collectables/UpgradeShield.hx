package com.isartdigital.operationaaa.game.sprites.collectables;
import com.isartdigital.utils.game.PoolManager;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class UpgradeShield extends Upgrade {

	public function new() {
		super();
		PoolManager.getInstance().addToPool('UpgradeShield', this);
	}
	
	override function setModeNormal():Void {
		super.setModeNormal();
		setState(DEFAULT_STATE, false, false, 3);
	}
}