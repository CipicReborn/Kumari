package com.isartdigital.operationaaa.game.sprites.collectables;
import com.isartdigital.utils.game.PoolManager;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class UpgradeMagnet extends Upgrade {

	public function new() {
		super();
		PoolManager.getInstance().addToPool('UpgradeMagnet', this);
	}
	
	override function setModeNormal():Void {
		super.setModeNormal();
		setState(DEFAULT_STATE, false, false, 4);
	}
}