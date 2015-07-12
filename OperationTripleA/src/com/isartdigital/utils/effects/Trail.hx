package com.isartdigital.utils.effects;

import com.isartdigital.operationaaa.Main;
import com.isartdigital.utils.events.GameEvent;
import com.isartdigital.utils.game.GameObject;
import pixi.display.DisplayObject;
import pixi.display.DisplayObjectContainer;
import pixi.display.Sprite;
import pixi.geom.Point;
import pixi.primitives.Graphics;

/**
 * Classe qui permet d'ajouter une trainée derrière un DisplayObject afin d'analyser son mouvement
 * @author Mathieu ANTHOINE
 */
class Trail extends GameObject
{

	private var target:DisplayObject;
	private var frequency:Float;
	private var counter:UInt = 0;
	private var list:Array<DisplayObjectContainer> = [];
	private var oldPos:Point = new Point(0, 0);
	private var persistence:Float;
	
	/**
	 * 
	 * @param	pTarget cible du Trail
	 * @param	pFrequency fréquence d'apparition des points (0 (importante) et 1 (faible))
	 * @param	pPersistence persistence des points à l'écran (0 (rapide) à 1 (permanent))
	 */
	public function new(pTarget:DisplayObject,pFrequency:Float=0,pPersistence:Float=0) 
	{
		super();
		target = pTarget;
		frequency = Math.max(0,Math.min(pFrequency,1)) * 4;
		persistence = 0.95 + Math.max(0, Math.min(pPersistence, 1)) / 20;
		target.parent.addChildAt(this, target.parent.getChildIndex(target));
		start();
	}
	
	override private function setModeNormal ():Void {
		super.setModeNormal();
		Main.getInstance().addEventListener(GameEvent.GAME_LOOP, doAction);
	}
	
	override function doActionNormal ():Void {
		
		for (i in 0...list.length) {
			list[i].scale.x *= persistence;
			list[i].scale.y *= persistence;
			list[i].alpha *= persistence;
		}
		
		if (list.length>0 && list[0].scale.x < 0.1) removeChild(list.shift());
		
		if (++counter > frequency && (oldPos.x!=target.x || oldPos.y!=target.y)) {
			var lCircle:DisplayObjectContainer = new DisplayObjectContainer();
			var lGraph:Graphics = new Graphics();
			lGraph.beginFill(0xFFFFFF);
			lGraph.drawCircle(0,0, 20);
			lGraph.endFill();
			lCircle.position = target.position.clone();
			lCircle.addChild(lGraph);
			addChild(lCircle);
			list.push(lCircle);
			counter = 0;
		}
		
		oldPos = target.position.clone();
	}
	
	override public function destroy():Void {
		Main.getInstance().removeEventListener(GameEvent.GAME_LOOP, doAction);
		target.parent.removeChild(this);
		target = null;
		super.destroy();
	}
	
	
}