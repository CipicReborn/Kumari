package com.isartdigital.operationaaa.ui.elements;
import com.isartdigital.utils.game.GameObject;
import com.isartdigital.utils.game.StateGraphic;
import pixi.display.DisplayObjectContainer;

/**
 * ...
 * @author Cyprien LARROUY
 */
class MiniGauge extends GameObject {
	
	private var maxCount: Int;
	private var currentCount: Int;
	private var radius: Int;
	private var spread: Float;
	
	private var gems: Array<MiniGem>;
	
	private var frameCount: Int;
	
	/**
	 * compteur pour faire blober le bouton play;
	 */
	private var blobCount: Float;	
	
	public function new(pCurrentCount: Int, pMaxCount: Int, pRadius: Int) {
		
		super();
		
		currentCount = pCurrentCount;
		maxCount = pMaxCount;
		radius = pRadius;
		spread = 2 * Math.PI / maxCount;
		gems = [];
		var lGem: MiniGem;
		
		for (i in 0...maxCount) {
			
			lGem = new MiniGem(- Math.PI / 2 + Math.round(i * spread * 100)/100);
			lGem.start();
			lGem.x = radius * Math.cos(spread * i);
			lGem.y = radius * Math.sin(spread * i);
			
			addChild(lGem);
			gems.push(lGem);
		}
	}
	
	override function setModeNormal():Void {
		super.setModeNormal();
		reinitGauge();
	}
	
	private function reinitGauge (): Void {
		
		for (i in 0...maxCount) {
			gems[i].setModeNormal();
		}
		
		frameCount = 0;
		blobCount = 0;
	}
	
	override function doActionNormal():Void {
		scale.x = 1 + Math.sin(blobCount) * 0.01;
		scale.y = 1 + Math.sin(blobCount) * 0.01;
		blobCount += 0.1;
		
		if (frameCount < currentCount) {
			gems[frameCount].setModeFull();
			frameCount++;
		}
		
		for (i in 0...maxCount) {
			gems[i].doAction();
		}
		
	}
}