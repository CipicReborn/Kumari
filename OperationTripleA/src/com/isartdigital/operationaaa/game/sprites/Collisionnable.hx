package com.isartdigital.operationaaa.game.sprites;
import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.StateGraphic;
import com.isartdigital.utils.loader.Loader;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class Collisionnable extends Mobile {

	public function new() {
		
		super();
		boxType = BoxType.SIMPLE;
	}
	
	override private function setModeNormal():Void {
		
		super.setModeNormal();
		setState(DEFAULT_STATE);
		
		doAction = doActionNormal;
	}
	
	
}