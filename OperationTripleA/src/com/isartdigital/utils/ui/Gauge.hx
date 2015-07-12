package com.isartdigital.utils.ui;


import pixi.display.Sprite;
import pixi.primitives.Graphics;
import pixi.textures.Texture;

/**
 * ...
 * @author Recol Cedric
 */
class Gauge extends Sprite
{
	private var DEG2RAD:Float = Math.PI / 180;
	/*
	 * si on utilise une spritesheet
	private var background:Sprite;
	private var gauge:Sprite;
	private var foreground:Sprite;
	*/
	private var currentLevelCollectible:Int = Math.floor(Math.random() * 50); // pour toujours avoir un ecart compris entre 0 et 50 collectibles
	private var playerCollectible:Int = Math.floor(Math.random() * 100);
	
	private var debut:Int = 270;
	private var tailleArc:Float;

	private var lTexture:Texture;
	
	public function new() 
	{
		currentLevelCollectible += playerCollectible;
		//trace("----------------------------" + currentLevelCollectible + "------------------currentLevelCollectible--------------");
		//trace("----------------------------" + playerCollectible + "------------------playerCollectible--------------");
		lTexture = null;
		super(lTexture);
		
		
		
		var bkground:Graphics = new Graphics();
		bkground.beginFill(0xFF0000, 1);
		bkground.drawCircle(0, 0, 100);
		bkground.endFill();
		addChild(bkground);
		//trace(bkground.position);
		
		var gauge:Graphics = new Graphics();
		gauge.beginFill(0xF0C300, 1);
		gauge.drawCircle(0, 0, 80);
		gauge.endFill();
		addChild(gauge);
		//trace(gauge.position);
		
		tailleArc = (360 / currentLevelCollectible * playerCollectible);
		
		
		var masque:Graphics = new Graphics();
		masque.beginFill(0xFFFFFF, 1);
		masque.moveTo(0, 0);
		masque.arc(0, 0, 80, debut * DEG2RAD, tailleArc * DEG2RAD);
		masque.isMask = true;
		masque.endFill();
		addChild(masque);
		
		//trace(masque.position);
		
		gauge.mask = masque;

		var foreground:Graphics = new Graphics();
		foreground.beginFill(0xFF0000, 1);
		foreground.drawCircle(0, 0, 50);
		foreground.endFill();
		addChild(foreground);
		//trace(foreground.position);		

	}

	/*
	 * NICE TO HAVE
	 * on essaie de placer ça dans une fonction qui pourras call un son et qui fera ça de façon juicy
	 * */
	
}