package com.isartdigital.operationaaa.ui.buttons;
import com.isartdigital.utils.ui.Button;

/**
 * ...
 * @author Benjamin PAGEAUD
 */
class ButtonSoundOn extends Button
{

	public function new() 
	{
		super();
	}
	
	override public function setModeNormal():Void {
		super.setModeNormal();
		setState(DEFAULT_STATE);
		anim.scale.x *= 0.70;
		anim.scale.y *= 0.70;
	}
	
}