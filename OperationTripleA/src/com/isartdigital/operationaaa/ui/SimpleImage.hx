package com.isartdigital.operationaaa.ui;

import com.isartdigital.utils.game.BoxType;
import com.isartdigital.utils.game.StateGraphic;

/**
 * ...
 * @author Cyprien LARROUY
 */
class SimpleImage extends StateGraphic{

	public function new(pAssetName: String, pAnchorX: Float, pAnchorY: Float) {
		super();
		assetName = pAssetName;
		boxType = BoxType.NONE;
		setState(DEFAULT_STATE);
		anim.anchor.set(pAnchorX, pAnchorY);
	}
	
	//public var width (get, set): Float;
	
	private function get_width (): Float {
		
		return anim.width;
	}
	
	private function set_width (pValue: Float): Float {
		
		anim.width = pValue;
		return anim.width;
	}
	
	private function get_height (): Float {
		
		return anim.height;
	}
	
	private function set_height (pValue: Float): Float {
		
		anim.height = pValue;
		return anim.height;
	}
}