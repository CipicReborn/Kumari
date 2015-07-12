package com.isartdigital.operationaaa.ui.buttons;

import com.isartdigital.utils.ui.Button;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class ButtonRefuse extends Button
{

	public function new() 
	{
		super();
		
	}
	
	override public function setModeNormal():Void {
		super.setModeNormal();
		setState(DEFAULT_STATE);
		anim.scale.x = anim.scale.y *= 0.55;
	}
	
}