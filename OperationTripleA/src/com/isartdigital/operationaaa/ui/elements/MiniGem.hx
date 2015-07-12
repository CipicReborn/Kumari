package com.isartdigital.operationaaa.ui.elements;

import com.isartdigital.utils.game.StateGraphic;

/**
 * ...
 * @author Cyprien LARROUY
 */
class MiniGem extends StateGraphic{
	
	
	public function new(pRotation: Float) {
		super();
		rotation = pRotation;
	}
	
	override function setModeNormal():Void {
		super.setModeNormal();
		setState("empty");
	}
	
	public function setModeFull(): Void {
		setState("full");
		//trace(anim.totalFrames);
	}
}