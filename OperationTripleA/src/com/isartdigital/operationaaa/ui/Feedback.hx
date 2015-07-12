package com.isartdigital.operationaaa.ui;

import com.isartdigital.utils.Config;
import com.isartdigital.utils.game.StateGraphic;
import pixi.display.Sprite;
import pixi.textures.Texture;


/**
 * ...
 * @author Cyprien LARROUY
 */
class Feedback extends StateGraphic {

	public function new(pAssetName:String) {
		//trace("[Feedback.new] Building new Feedback");
		super();
		assetName = pAssetName;
	}
	
	public function init (): Void {
		
		setState(DEFAULT_STATE);
		anim.anchor.set(0.5, 0.5);
		anim.scale.set(0.5, 0.5);
	}
	
}