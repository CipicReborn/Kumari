package com.isartdigital.operationaaa.controller;

import com.isartdigital.utils.Config;
import pixi.display.Sprite;
import pixi.textures.Texture;

/**
 * 
 * @author Cyprien LARROUY
 */
class TouchDetectionZone extends Sprite{

	public function new() {
		
		super(Texture.fromImage(Config.assetsPath + "touchzone.png"));
	}
	
}